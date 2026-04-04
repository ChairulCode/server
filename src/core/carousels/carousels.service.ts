import db from "../../shared/config/db";

interface CarouselInput {
	judul: string;
	urutan: number;
	konten: string;
	path_gambar: string;
	tanggal_publikasi: Date;
	is_published?: boolean;
	is_featured?: boolean;
	jenjang_id: string | null;
	penulis_user_id: string;
	editor_user_id: string | null;
}

/**
 * Ambil carousel untuk tampilan PUBLIC berdasarkan kode_jenjang.
 *
 * Logika filter:
 * - Jika kode_jenjang ada (misal "SMA") → carousel jenjang tsb + carousel global (jenjang_id = null)
 * - Jika kode_jenjang tidak ada (halaman utama) → hanya carousel global (jenjang_id = null)
 * - Hanya yang is_published = true
 * - Sorted by urutan ASC
 */
const ambilCarouselPublik = async (kode_jenjang?: string) => {
	try {
		console.log("🚀 [DEBUG] Request Jenjang:", kode_jenjang);

		// KASUS 1: Mengakses halaman tingkatan (SMA, SMP, dll)
		if (kode_jenjang) {
			const jenjang = await db.jenjang.findFirst({
				where: {
					kode_jenjang: {
						equals: kode_jenjang.toUpperCase(),
						mode: "insensitive",
					},
				},
			});

			console.log("🔍 [DEBUG] Jenjang Found in DB:", jenjang);

			if (!jenjang) {
				console.log("⚠️ [DEBUG] Jenjang not found, returning empty.");
				return { data: [], jenjang: null };
			}

			// FILTER: Hanya ambil yang miliki jenjang_id ini (TIDAK BOLEH ADA OR jenjang_id: null)
			const carousels = await db.carousel.findMany({
				where: {
					is_published: true,
					jenjang_id: jenjang.jenjang_id, // Kunci utama ada di sini
				},
				include: {
					jenjang: { select: { jenjang_id: true, nama_jenjang: true, kode_jenjang: true } },
					penulis: { select: { user_id: true, username: true, nama_lengkap: true } },
				},
				orderBy: { urutan: "asc" },
			});

			console.log(`✅ [DEBUG] Found ${carousels.length} carousels for ${kode_jenjang}`);

			return {
				data: carousels,
				jenjang: {
					jenjang_id: jenjang.jenjang_id,
					nama_jenjang: jenjang.nama_jenjang,
					kode_jenjang: jenjang.kode_jenjang,
				},
			};
		}

		// KASUS 2: Halaman Utama (Global)
		console.log("🏠 [DEBUG] Fetching Global Carousels (Home Page)");

		const carousels = await db.carousel.findMany({
			where: {
				is_published: true,
				jenjang_id: null, // Hanya yang dibuat oleh Superadmin untuk Home
			},
			include: {
				jenjang: { select: { jenjang_id: true, nama_jenjang: true, kode_jenjang: true } },
				penulis: { select: { user_id: true, username: true, nama_lengkap: true } },
			},
			orderBy: { urutan: "asc" },
		});

		return { data: carousels, jenjang: null };
	} catch (error) {
		console.error("❌ [ERROR] ambilCarouselPublik:", error);
		throw error;
	}
};

const buatCarousel = async (data: CarouselInput) => {
	try {
		// 1. Hitung jumlah carousel yang sudah ada berdasarkan jenjang_id
		const count = await db.carousel.count({
			where: { jenjang_id: data.jenjang_id },
		});

		// 2. Cek Limit (Maksimal 10)
		if (count >= 10) {
			const lokasi = data.jenjang_id ? "jenjang ini" : "Halaman Utama (Global)";
			throw new Error(`Batas maksimal carousel untuk ${lokasi} adalah 10 konten.`);
		}

		// 3. Cari urutan tertinggi saat ini untuk autoincrement manual
		const lastCarousel = await db.carousel.findFirst({
			where: { jenjang_id: data.jenjang_id },
			orderBy: { urutan: "desc" },
			select: { urutan: true },
		});

		const urutanBaru = lastCarousel ? lastCarousel.urutan + 1 : 1;

		// 4. Simpan ke database
		const result = await db.carousel.create({
			data: {
				...data,
				urutan: urutanBaru,
			},
			include: {
				jenjang: true,
			},
		});
		return result;
	} catch (error) {
		// Teruskan error agar bisa ditangkap oleh controller (misal: error limit 10)
		throw error;
	}
};

const ambilSemuaCarousel = async (
	page: number,
	limit: number,
	userRole: string,
	allowedJenjangIds: string[] | undefined
) => {
	try {
		const pageNum = parseInt(page as any);
		const limitNum = parseInt(limit as any);

		let whereClause: any = {};

		// ✅ PERBAIKAN: Normalisasi role dengan hapus spasi
		const normalizedRole = userRole.toLowerCase().replace(/\s+/g, "");
		console.log("🔍 Debug Role Check:");
		console.log("  - Original Role:", userRole);
		console.log("  - Normalized:", normalizedRole);
		console.log("  - Is SuperAdmin?", normalizedRole.includes("superadmin"));
		console.log("  - Allowed Jenjangs:", allowedJenjangIds);
		console.log("  - Where Clause:", whereClause);

		if (normalizedRole.includes("superadmin") || normalizedRole.includes("superadministrator")) {
			// Superadmin HANYA melihat carousel global (Halaman Utama)
			whereClause = { jenjang_id: null };
		} else if (allowedJenjangIds && allowedJenjangIds.length > 0) {
			// Admin Jenjang HANYA melihat carousel milik jenjangnya
			whereClause = {
				jenjang_id: {
					in: allowedJenjangIds,
				},
			};
		} else {
			// Jika role tidak dikenali, jangan tampilkan apa-apa (safety)
			return { metadata: {}, data: [] };
		}

		const [result, total] = await Promise.all([
			db.carousel.findMany({
				where: whereClause,
				take: limitNum,
				skip: (pageNum - 1) * limitNum,
				orderBy: { urutan: "asc" },
				include: {
					jenjang: true,
					penulis: true,
				},
			}),
			db.carousel.count({ where: whereClause }),
		]);

		return {
			metadata: {
				totalItems: total,
				totalPages: Math.ceil(total / limitNum),
				currentPage: pageNum,
				limit: limitNum,
			},
			data: result,
		};
	} catch (error) {
		throw error;
	}
};

const ambilDetailCarousel = async (carousel_id: string) => {
	try {
		const result = await db.carousel.findUnique({
			where: {
				carousel_id,
			},
			include: {
				jenjang: true,
				penulis: true,
				editor: true,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const editCarouselLengkap = async (carousel_id: string, data: CarouselInput) => {
	try {
		const urutanBaru = data.urutan;

		const result = await db.$transaction(async (tx) => {
			// 1. Ambil data lama untuk tahu urutan & jenjang sebelumnya
			const carouselLama = await tx.carousel.findUnique({
				where: { carousel_id },
				select: { urutan: true, jenjang_id: true },
			});

			if (!carouselLama) throw new Error("Carousel tidak ditemukan");

			const urutanLama = carouselLama.urutan;
			const jenjangLama = carouselLama.jenjang_id;

			// 2. Logika pergeseran hanya jalan jika urutan berubah
			// Kita juga pastikan pergeseran terjadi dalam lingkup jenjang yang sama
			if (urutanLama !== urutanBaru && jenjangLama === data.jenjang_id) {
				if (urutanBaru < urutanLama) {
					// Kasus: Geser ke ATAS (misal 3 jadi 1)
					// Data di urutan 1 & 2 harus +1 (jadi 2 & 3)
					await tx.carousel.updateMany({
						where: {
							jenjang_id: jenjangLama,
							urutan: { gte: urutanBaru, lt: urutanLama },
						},
						data: { urutan: { increment: 1 } },
					});
				} else {
					// Kasus: Geser ke BAWAH (misal 1 jadi 3)
					// Data di urutan 2 & 3 harus -1 (jadi 1 & 2)
					await tx.carousel.updateMany({
						where: {
							jenjang_id: jenjangLama,
							urutan: { gt: urutanLama, lte: urutanBaru },
						},
						data: { urutan: { decrement: 1 } },
					});
				}
			}

			// 3. Update data target dengan informasi baru
			return await tx.carousel.update({
				where: { carousel_id },
				data: data,
				include: { jenjang: true },
			});
		});

		return result;
	} catch (error) {
		console.error("Terjadi kesalahan saat edit carousel!", error);
		throw error;
	}
};

const editCarouselSebagian = async (carousel_id: string, data: Partial<CarouselInput>) => {
	try {
		const result = await db.carousel.update({
			where: {
				carousel_id,
			},
			data: data,
			include: {
				jenjang: true,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const hapusCarousel = async (carousel_id: string) => {
	try {
		// 1. Cari data yang akan dihapus untuk tahu urutan & jenjangnya
		const target = await db.carousel.findUnique({
			where: { carousel_id },
			select: { urutan: true, jenjang_id: true },
		});

		if (!target) throw new Error("Carousel tidak ditemukan");

		// 2. Gunakan Prisma Transaction untuk memastikan integritas data
		const result = await db.$transaction(async (tx) => {
			// Hapus data target
			const deleted = await tx.carousel.delete({
				where: { carousel_id },
			});

			// Geser semua data yang urutannya DI ATAS data yang dihapus
			await tx.carousel.updateMany({
				where: {
					jenjang_id: target.jenjang_id,
					urutan: { gt: target.urutan }, // gt = Greater Than
				},
				data: {
					urutan: { decrement: 1 }, // Kurangi urutan sebesar 1
				},
			});

			return deleted;
		});

		return result;
	} catch (error) {
		console.error("Terjadi kesalahan saat menghapus carousel!", error);
		throw error;
	}
};

export default {
	ambilCarouselPublik,
	buatCarousel,
	ambilSemuaCarousel,
	ambilDetailCarousel,
	editCarouselLengkap,
	editCarouselSebagian,
	hapusCarousel,
};
