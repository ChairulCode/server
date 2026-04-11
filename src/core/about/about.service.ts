import db from "../../shared/config/db";

interface AboutInput {
	hero_badge?: string;
	hero_title: string;
	hero_subtitle?: string;
	hero_image?: string;
	hero_meta_pills?: any;
	description_text?: string;
	visi_quote?: string;
	highlights?: any;
	fasilitas_items?: any;
	cta_title?: string;
	cta_description?: string;
	cta_button_text?: string;
	cta_button_url?: string;
	is_published?: boolean;
	jenjang_id: string | null;
	penulis_user_id: string;
	editor_user_id: string | null;
}

/**
 * Ambil about untuk tampilan PUBLIC berdasarkan kode_jenjang.
 */
const ambilAboutPublik = async (kode_jenjang?: string) => {
	try {
		console.log("🚀 [DEBUG] Request Jenjang:", kode_jenjang);

		if (kode_jenjang) {
			const jenjang = await db.jenjang.findFirst({
				where: {
					kode_jenjang: {
						equals: kode_jenjang.toUpperCase(),
						// mode: "insensitive",
					},
				},
			});

			console.log("🔍 [DEBUG] Jenjang Found in DB:", jenjang);

			if (!jenjang) {
				console.log("⚠️ [DEBUG] Jenjang not found, returning empty.");
				return { data: null, jenjang: null };
			}

			const about = await db.about.findFirst({
				where: {
					is_published: true,
					jenjang_id: jenjang.jenjang_id,
				},
				include: {
					jenjang: { select: { jenjang_id: true, nama_jenjang: true, kode_jenjang: true } },
					penulis: { select: { user_id: true, username: true, nama_lengkap: true } },
				},
			});

			console.log(`✅ [DEBUG] Found about for ${kode_jenjang}`);

			return {
				data: about,
				jenjang: {
					jenjang_id: jenjang.jenjang_id,
					nama_jenjang: jenjang.nama_jenjang,
					kode_jenjang: jenjang.kode_jenjang,
				},
			};
		}

		// KASUS 2: Halaman Utama (Global) - jenjang_id = null
		console.log("🏠 [DEBUG] Fetching Global About (Home Page)");

		const about = await db.about.findFirst({
			where: {
				is_published: true,
				jenjang_id: null,
			},
			include: {
				jenjang: { select: { jenjang_id: true, nama_jenjang: true, kode_jenjang: true } },
				penulis: { select: { user_id: true, username: true, nama_lengkap: true } },
			},
		});

		return { data: about, jenjang: null };
	} catch (error) {
		console.error("❌ [ERROR] ambilAboutPublik:", error);
		throw error;
	}
};

const buatAbout = async (data: AboutInput) => {
	try {
		// 1. Cek apakah sudah ada about untuk jenjang ini
		const existing = await db.about.findFirst({
			where: { jenjang_id: data.jenjang_id },
		});

		if (existing) {
			const lokasi = data.jenjang_id ? "jenjang ini" : "Halaman Utama (Global)";
			throw new Error(`About untuk ${lokasi} sudah ada. Silakan edit yang sudah ada.`);
		}

		// 2. Simpan ke database
		const result = await db.about.create({
			data: data,
			include: {
				jenjang: true,
			},
		});
		return result;
	} catch (error) {
		throw error;
	}
};

const ambilSemuaAbout = async (
	page: number,
	limit: number,
	userRole: string,
	allowedJenjangIds: string[] | undefined
) => {
	try {
		const pageNum = parseInt(page as any);
		const limitNum = parseInt(limit as any);

		let whereClause: any = {};

		const normalizedRole = userRole.toLowerCase().replace(/\s+/g, "");
		console.log("🔍 Debug Role Check:");
		console.log("  - Original Role:", userRole);
		console.log("  - Normalized:", normalizedRole);
		console.log("  - Is SuperAdmin?", normalizedRole.includes("superadmin"));

		if (normalizedRole.includes("superadmin") || normalizedRole.includes("superadministrator")) {
			// Superadmin melihat semua
			whereClause = {};
		} else if (allowedJenjangIds && allowedJenjangIds.length > 0) {
			// Admin Jenjang HANYA melihat about milik jenjangnya
			whereClause = {
				jenjang_id: {
					in: allowedJenjangIds,
				},
			};
		} else {
			return { metadata: {}, data: [] };
		}

		const [result, total] = await Promise.all([
			db.about.findMany({
				where: whereClause,
				take: limitNum,
				skip: (pageNum - 1) * limitNum,
				orderBy: { updated_at: "desc" },
				include: {
					jenjang: true,
					penulis: true,
				},
			}),
			db.about.count({ where: whereClause }),
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

const ambilDetailAbout = async (about_id: string) => {
	try {
		const result = await db.about.findUnique({
			where: {
				about_id,
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

const editAboutLengkap = async (about_id: string, data: AboutInput) => {
	try {
		const result = await db.about.update({
			where: { about_id },
			data: data,
			include: { jenjang: true },
		});

		return result;
	} catch (error) {
		console.error("Terjadi kesalahan saat edit about!", error);
		throw error;
	}
};

const editAboutSebagian = async (about_id: string, data: Partial<AboutInput>) => {
	try {
		const result = await db.about.update({
			where: {
				about_id,
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

const hapusAbout = async (about_id: string) => {
	try {
		const result = await db.about.delete({
			where: { about_id },
		});

		return result;
	} catch (error) {
		console.error("Terjadi kesalahan saat menghapus about!", error);
		throw error;
	}
};

export default {
	ambilAboutPublik,
	buatAbout,
	ambilSemuaAbout,
	ambilDetailAbout,
	editAboutLengkap,
	editAboutSebagian,
	hapusAbout,
};
