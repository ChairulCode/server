import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// UUID Validation Regex (Standard v4)
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// --- Validasi Relasi M:M Jenjang ---
const validasiJenjangArray = body("jenjang_ids")
	.optional({ nullable: true })
	.isArray()
	.withMessage("Jenjang ID harus berupa array.")
	.custom((value: string[]) => {
		if (value && value.length > 0) {
			const invalidIds = value.filter((id) => !id.match(uuidV4Regex));
			if (invalidIds.length > 0) {
				throw new Error("Semua Jenjang ID di array harus berupa UUID v4 yang valid.");
			}
		}
		return true;
	});

// ====================================================
// VALIDASI BUAT PENGUMUMAN (CREATE)
// ====================================================
export const validasiBuatPengumuman = [
	// 1. Judul: Wajib diisi, string, minimal 5 karakter
	body("judul")
		.notEmpty()
		.withMessage("Judul pengumuman wajib diisi.")
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	// 2. Deskripsi (Menggantikan pesan_singkat): Wajib diisi, minimal 10 karakter
	body("deskripsi")
		.notEmpty()
		.withMessage("Deskripsi (Pesan singkat) wajib diisi.")
		.isString()
		.withMessage("Deskripsi harus berupa teks.")
		.isLength({ min: 10 })
		.withMessage("Deskripsi minimal 10 karakter."),

	// 3. Konten: Opsional (nullable), jika ada harus string
	body("konten").optional({ nullable: true }).isString().withMessage("Konten harus berupa teks."),

	// 4. Prioritas (ENUM): Wajib diisi dan harus sesuai nilai ENUM
	body("prioritas")
		.notEmpty()
		.withMessage("Prioritas wajib diisi.")
		.isIn(["high", "medium", "low"])
		.withMessage("Prioritas tidak valid. Pilih salah satu: high, medium, atau low."),

	// 5. Tanggal Publikasi: Wajib diisi, harus valid date time
	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	// 6. Penulis ID (UUID): Wajib diisi
	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	// 7. Editor ID (UUID): Opsional
	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

	// 8. Is Featured (Menggantikan is_sticky): Opsional, harus boolean
	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("Status 'Is Featured' harus berupa boolean (true/false).")
		.toBoolean(),

	// 9. Relasi M:M (Menggantikan audiens_jenjang_id)
	validasiJenjangArray,

	checkValidationResult,
];

// ====================================================
// VALIDASI EDIT PENGUMUMAN (PUT/PATCH)
// ====================================================
export const validasiEditPengumuman = [
	// ID Pengumuman (dari params, wajib UUID)
	param("pengumuman_id")
		.exists()
		.withMessage("ID Pengumuman wajib disertakan di parameter.")
		.isUUID(4)
		.withMessage("ID Pengumuman harus berupa UUID v4 yang valid."),

	// 1. Judul: Opsional, jika ada, minimal 5 karakter
	body("judul")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	// 2. Deskripsi: Opsional, jika ada, minimal 10 karakter
	body("deskripsi")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks.")
		.isLength({ min: 10 })
		.withMessage("Deskripsi minimal 10 karakter."),

	// 3. Konten: Opsional
	body("konten").optional({ nullable: true }).isString().withMessage("Konten harus berupa teks."),

	// 4. Prioritas (ENUM): Opsional
	body("prioritas")
		.optional({ checkFalsy: true })
		.isIn(["high", "medium", "low"])
		.withMessage("Prioritas tidak valid. Pilih salah satu: high, medium, atau low."),

	// 5. Tanggal Publikasi: Opsional
	body("tanggal_publikasi")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	// 6. Penulis ID (UUID): Opsional
	body("penulis_user_id")
		.optional({ checkFalsy: true })
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	// 7. Editor ID (UUID): Opsional
	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

	// 8. Is Featured: Opsional, harus boolean
	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("Status 'Is Featured' harus berupa boolean.")
		.toBoolean(),

	// 9. Relasi M:M (Menggantikan audiens_jenjang_id)
	validasiJenjangArray,

	checkValidationResult,
];

// ====================================================
// VALIDASI HAPUS & DETAIL (Param ID)
// ====================================================

const validasiIdPengumumanParam = [
	param("pengumuman_id").isUUID(4).withMessage("ID Pengumuman harus berupa UUID v4 yang valid."),
	checkValidationResult,
];

export const validasiHapusPengumuman = validasiIdPengumumanParam;

export const validasiAmbilDetailPengumuman = validasiIdPengumumanParam;
