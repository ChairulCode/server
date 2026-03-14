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
// VALIDASI BUAT KEGIATAN (CREATE)
// ====================================================
export const validasiAmbilDetailKegiatan = [
	param("kegiatan_id").isUUID(4).withMessage("ID Kegiatan harus berupa UUID (String)."),
];

// ====================================================
// VALIDASI BUAT KEGIATAN (CREATE)
// ====================================================
export const validasiBuatKegiatan = [
	// 1. Judul (Wajib diisi, string, minimal 5 karakter)
	body("judul")
		.notEmpty()
		.withMessage("Judul kegiatan wajib diisi.")
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	// 2. Konten (Wajib diisi, string, minimal 50 karakter)
	body("konten")
		.notEmpty()
		.withMessage("Konten/Isi kegiatan wajib diisi.")
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 50 })
		.withMessage("Konten minimal 50 karakter."),

	// 3. Deskripsi (Opsional, string)
	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	// 4. Path Gambar (Opsional, string)
	body("path_gambar")
		.optional({ nullable: true })
		.isString()
		.withMessage("Path gambar utama harus berupa teks."),

	// 5. Tanggal Publikasi (Wajib diisi, valid date time)
	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	// 6. Penulis ID (Wajib diisi, UUID)
	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	// 7. Editor ID (Opsional, UUID)
	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

	// 8. Relasi M:M
	validasiJenjangArray,

	checkValidationResult,
];

// ====================================================
// VALIDASI EDIT KEGIATAN (PUT/PATCH)
// ====================================================
export const validasiEditKegiatan = [
	// 1. ID Kegiatan (dari params, wajib UUID)
	param("kegiatan_id")
		.exists()
		.withMessage("ID Kegiatan wajib disertakan di parameter.")
		.isUUID(4)
		.withMessage("ID Kegiatan harus berupa UUID v4 yang valid."),

	// Field Opsional di Body:

	// 2. Judul
	body("judul")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	// 3. Konten
	body("konten")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 50 })
		.withMessage("Konten minimal 50 karakter."),

	// 4. Deskripsi
	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	// 5. Path Gambar
	body("path_gambar")
		.optional({ nullable: true })
		.isString()
		.withMessage("Path gambar utama harus berupa teks."),

	// 6. Tanggal Publikasi
	body("tanggal_publikasi")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	// 7. Penulis ID
	body("penulis_user_id")
		.optional({ checkFalsy: true })
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	// 8. Editor ID
	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

	// 9. Status Boolean (is_published, is_featured)
	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false)"),

	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("is_featured harus berupa boolean (true/false)"),

	// 10. Relasi M:M
	validasiJenjangArray,
	checkValidationResult,
];

// ====================================================
// VALIDASI HAPUS KEGIATAN (DELETE /kegiatan/:id)
// ====================================================
export const validasiHapusKegiatan = [
	param("kegiatan_id").isUUID(4).withMessage("ID Kegiatan yang dihapus harus berupa UUID v4 yang valid."),
	checkValidationResult,
];
