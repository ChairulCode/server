import db from "../../shared/config/db";
import fs from "fs";
import path from "path";

const MAX_GAMBAR = 3;

// Folder tempat gambar fasilitas disimpan (di dalam /public)
// Gambar diakses via: http://localhost:3000/facilities/nama-file.webp
const FOLDER = "facilities";

// ─── TIPE ─────────────────────────────────────────────────────────────────────

type FasilitasPayload = {
	nama: string;
	deskripsi?: string | null;
	icon?: string | null;
	urutan?: number | null;
	is_active?: boolean;
};

// ─── HELPER: hapus file fisik ─────────────────────────────────────────────────

const hapusFileFisik = (pathGambar: string) => {
	// pathGambar contoh: "facilities/nama-file.webp"
	// fullPath  contoh: "public/facilities/nama-file.webp"
	const fullPath = path.join("public", pathGambar);
	try {
		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath);
		} else {
			console.warn("File fisik tidak ditemukan:", fullPath);
		}
	} catch (err) {
		console.error("Gagal hapus file fisik:", err);
	}
};

// ─── FASILITAS ────────────────────────────────────────────────────────────────

const buatFasilitas = async (data: FasilitasPayload) => {
	try {
		return await db.fasilitas.create({
			data: {
				nama: data.nama,
				deskripsi: data.deskripsi ?? null,
				icon: data.icon ?? null,
				urutan: data.urutan ?? null,
				is_active: data.is_active ?? true,
			},
			include: {
				gambar: { orderBy: { urutan: "asc" } },
			},
		});
	} catch (error) {
		console.error("buatFasilitas error:", error);
		throw error;
	}
};

const ambilSemuaFasilitas = async (page: number, limit: number) => {
	try {
		const [data, total] = await Promise.all([
			db.fasilitas.findMany({
				take: limit,
				skip: (page - 1) * limit,
				orderBy: [{ urutan: "asc" }, { created_at: "desc" }],
				include: {
					gambar: { orderBy: { urutan: "asc" } },
				},
			}),
			db.fasilitas.count(),
		]);

		return {
			metadata: {
				totalItems: total,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
				limit,
			},
			data,
		};
	} catch (error) {
		console.error("ambilSemuaFasilitas error:", error);
		throw error;
	}
};

const ambilDetailFasilitas = async (fasilitas_id: string) => {
	try {
		return await db.fasilitas.findUnique({
			where: { fasilitas_id },
			include: {
				gambar: { orderBy: { urutan: "asc" } },
			},
		});
	} catch (error) {
		console.error("ambilDetailFasilitas error:", error);
		throw error;
	}
};

const editFasilitasLengkap = async (fasilitas_id: string, data: FasilitasPayload) => {
	try {
		return await db.fasilitas.update({
			where: { fasilitas_id },
			data: {
				nama: data.nama,
				deskripsi: data.deskripsi ?? null,
				icon: data.icon ?? null,
				urutan: data.urutan ?? null,
				is_active: data.is_active ?? true,
			},
			include: {
				gambar: { orderBy: { urutan: "asc" } },
			},
		});
	} catch (error) {
		console.error("editFasilitasLengkap error:", error);
		throw error;
	}
};

const editFasilitasSebagian = async (fasilitas_id: string, data: Partial<FasilitasPayload>) => {
	try {
		return await db.fasilitas.update({
			where: { fasilitas_id },
			data,
			include: {
				gambar: { orderBy: { urutan: "asc" } },
			},
		});
	} catch (error) {
		console.error("editFasilitasSebagian error:", error);
		throw error;
	}
};

const hapusFasilitas = async (fasilitas_id: string) => {
	try {
		// Ambil semua gambar untuk hapus file fisiknya
		const gambarList = await db.fasilitas_gambar.findMany({
			where: { fasilitas_id },
		});

		// Hapus file fisik satu per satu
		for (const gambar of gambarList) {
			hapusFileFisik(gambar.path_gambar);
		}

		// Hapus record fasilitas (cascade otomatis hapus fasilitas_gambar di DB)
		return await db.fasilitas.delete({ where: { fasilitas_id } });
	} catch (error) {
		console.error("hapusFasilitas error:", error);
		throw error;
	}
};

// ─── GAMBAR ───────────────────────────────────────────────────────────────────

const uploadGambar = async (fasilitas_id: string, filename: string) => {
	// filename = hasil dari multer + compressImage, contoh: "nama-file.webp"
	// path_gambar yang disimpan DB: "facilities/nama-file.webp"
	const pathGambar = `${FOLDER}/${filename}`;

	try {
		// Cek batas maksimal gambar
		const jumlahGambar = await db.fasilitas_gambar.count({
			where: { fasilitas_id },
		});

		if (jumlahGambar >= MAX_GAMBAR) {
			// Hapus file yang sudah terlanjur diupload multer agar tidak jadi sampah
			hapusFileFisik(pathGambar);
			throw new Error(`Maksimal ${MAX_GAMBAR} gambar per fasilitas.`);
		}

		return await db.fasilitas_gambar.create({
			data: {
				fasilitas_id,
				path_gambar: pathGambar,
				urutan: jumlahGambar + 1,
			},
		});
	} catch (error) {
		console.error("uploadGambar error:", error);
		throw error;
	}
};

const hapusGambar = async (fasilitas_id: string, gambar_id: string) => {
	try {
		// Cari record gambar
		const gambar = await db.fasilitas_gambar.findFirst({
			where: { gambar_id, fasilitas_id },
		});

		if (!gambar) return null;

		// Hapus record dari DB
		await db.fasilitas_gambar.delete({ where: { gambar_id } });

		// Hapus file fisik
		hapusFileFisik(gambar.path_gambar);

		// Re-urutan sisa gambar agar tetap 1, 2, 3
		const sisaGambar = await db.fasilitas_gambar.findMany({
			where: { fasilitas_id },
			orderBy: { urutan: "asc" },
		});

		for (let i = 0; i < sisaGambar.length; i++) {
			await db.fasilitas_gambar.update({
				where: { gambar_id: sisaGambar[i].gambar_id },
				data: { urutan: i + 1 },
			});
		}

		return gambar;
	} catch (error) {
		console.error("hapusGambar error:", error);
		throw error;
	}
};

export default {
	buatFasilitas,
	ambilSemuaFasilitas,
	ambilDetailFasilitas,
	editFasilitasLengkap,
	editFasilitasSebagian,
	hapusFasilitas,
	uploadGambar,
	hapusGambar,
};
