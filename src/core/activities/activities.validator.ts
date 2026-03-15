import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// UUID Validation Regex (any version)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// --- Validasi Relasi M:M Jenjang ---
const validasiJenjangArray = body("jenjang_ids")
	.optional({ nullable: true })
	.isArray()
	.withMessage("Jenjang ID harus berupa array.")
	.custom((value: string[]) => {
		if (value && value.length > 0) {
			const invalidIds = value.filter((id) => !id.match(uuidRegex));
			if (invalidIds.length > 0) {
				throw new Error("Semua Jenjang ID di array harus berupa UUID yang valid.");
			}
		}
		return true;
	});

// ====================================================
// VALIDASI GET DETAIL KEGIATAN
// ====================================================
export const validasiAmbilDetailKegiatan = [
	param("kegiatan_id")
		.isUUID()
		.withMessage("ID Kegiatan harus berupa UUID (String)."),
	checkValidationResult,
];

// ====================================================
// VALIDASI BUAT KEGIATAN (CREATE)
// ====================================================
export const validasiBuatKegiatan = [
	body("judul")
		.notEmpty()
		.withMessage("Judul kegiatan wajib diisi.")
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Judul minimal 2 karakter dan maksimal 255 karakter."),

	body("konten")
		.notEmpty()
		.withMessage("Konten/Isi kegiatan wajib diisi.")
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 1 })
		.withMessage("Konten minimal 1 karakter."),

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("path_gambar")
		.optional({ nullable: true })
		.isString()
		.withMessage("Path gambar harus berupa teks."),

	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID()
		.withMessage("ID Penulis harus berupa UUID yang valid."),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID()
		.withMessage("ID Editor harus berupa UUID yang valid."),

	validasiJenjangArray,
	checkValidationResult,
];

// ====================================================
// VALIDASI EDIT KEGIATAN (PUT/PATCH)
// ====================================================
export const validasiEditKegiatan = [
	param("kegiatan_id")
		.exists()
		.withMessage("ID Kegiatan wajib disertakan di parameter.")
		.isUUID()
		.withMessage("ID Kegiatan harus berupa UUID yang valid."),

	body("judul")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Judul minimal 2 karakter dan maksimal 255 karakter."),

	body("konten")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 1 })
		.withMessage("Konten minimal 1 karakter."),

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("path_gambar")
		.optional({ nullable: true })
		.isString()
		.withMessage("Path gambar harus berupa teks."),

	body("tanggal_publikasi")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	body("penulis_user_id")
		.optional({ checkFalsy: true })
		.isUUID()
		.withMessage("ID Penulis harus berupa UUID yang valid."),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID()
		.withMessage("ID Editor harus berupa UUID yang valid."),

	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false)"),

	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("is_featured harus berupa boolean (true/false)"),

	// Abaikan kegiatan_id di body jika ikut terkirim
	body("kegiatan_id")
		.optional({ nullable: true })
		.isString(),

	validasiJenjangArray,
	checkValidationResult,
];

// ====================================================
// VALIDASI HAPUS KEGIATAN (DELETE)
// ====================================================
export const validasiHapusKegiatan = [
	param("kegiatan_id")
		.isUUID()
		.withMessage("ID Kegiatan yang dihapus harus berupa UUID yang valid."),
	checkValidationResult,
];