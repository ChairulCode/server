import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// Fungsi untuk memeriksa apakah array jenjang_id valid (M:M)
const validasiJenjangArray = body("jenjang_ids")
	.optional({ nullable: true })
	.isArray()
	.withMessage("Jenjang ID harus berupa array.")
	.custom((value: string[]) => {
		if (value && value.length > 0) {
			const invalidIds = value.filter(
				(id) => !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
			);
			if (invalidIds.length > 0) {
				throw new Error("Semua Jenjang ID di array harus berupa UUID yang valid.");
			}
		}
		return true;
	});

// --- Validasi GET Prestasi ---
export const validasiGetPrestasi = [
	param("prestasi_id")
		.exists()
		.withMessage("ID Prestasi wajib disertakan di parameter.")
		.isUUID()
		.withMessage("ID Prestasi harus berupa UUID (String)."),
	checkValidationResult,
];

// --- Validasi CREATE Prestasi ---
export const validasiBuatPrestasi = [
	body("judul")
		.notEmpty()
		.withMessage("Judul prestasi wajib diisi.")
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Judul minimal 2 karakter dan maksimal 255 karakter."),

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("konten")
		.notEmpty()
		.withMessage("Isi konten wajib diisi.")
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 1 })
		.withMessage("Konten minimal 1 karakter."),

	validasiJenjangArray,

	body("path_gambar")
		.optional({ nullable: true })
		.isString()
		.withMessage("Path gambar harus berupa teks."),

	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Tanggal publikasi harus dalam format ISO 8601."),

	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID()
		.withMessage("ID Penulis harus berupa UUID (String)."),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID()
		.withMessage("ID Editor harus berupa UUID (String)."),

	checkValidationResult,
];

// --- Validasi UPDATE (PUT) Prestasi ---
export const validasiPutPrestasi = [
	param("prestasi_id")
		.exists()
		.withMessage("ID Prestasi wajib disertakan di parameter.")
		.isUUID()
		.withMessage("ID Prestasi harus berupa UUID (String)."),

	body("judul")
		.notEmpty()
		.withMessage("Judul wajib diisi.")
		.isString()
		.isLength({ min: 2, max: 255 })
		.withMessage("Judul minimal 2 karakter dan maksimal 255 karakter."),

	body("konten")
		.notEmpty()
		.withMessage("Isi konten wajib diisi.")
		.isString()
		.isLength({ min: 1 })
		.withMessage("Konten minimal 1 karakter."),

	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Tanggal publikasi harus dalam format ISO 8601."),

	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID()
		.withMessage("ID Penulis harus berupa UUID (String)."),

	validasiJenjangArray,

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("path_gambar")
		.optional({ nullable: true })
		.isString()
		.withMessage("Path Gambar harus berupa teks."),

	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false)"),

	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("is_featured harus berupa boolean (true/false)"),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID()
		.withMessage("ID Editor harus berupa UUID (String)."),

	// Abaikan prestasi_id di body jika ikut terkirim
	body("prestasi_id").optional({ nullable: true }).isString(),

	checkValidationResult,
];

// --- Validasi PATCH Prestasi ---
export const validasiPatchPrestasi = [
	param("prestasi_id")
		.exists()
		.withMessage("ID Prestasi wajib disertakan di parameter.")
		.isUUID()
		.withMessage("ID Prestasi harus berupa UUID (String)."),

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

	body("tanggal_publikasi")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate()
		.withMessage("Tanggal publikasi harus dalam format ISO 8601."),

	body("penulis_user_id")
		.optional({ checkFalsy: true })
		.isUUID()
		.withMessage("ID Penulis harus berupa UUID (String)."),

	validasiJenjangArray,

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("path_gambar")
		.optional({ nullable: true })
		.isString()
		.withMessage("Path Gambar harus berupa teks."),

	body("tags")
		.optional({ nullable: true })
		.isString()
		.withMessage("Tags harus berupa teks string."),

	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false)"),

	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("is_featured harus berupa boolean (true/false)"),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID()
		.withMessage("ID Editor harus berupa UUID (String)."),

	checkValidationResult,
];

// --- Validasi DELETE Prestasi ---
export const validasiHapusPrestasi = [
	param("prestasi_id").isUUID().withMessage("ID yang dihapus harus berupa UUID (String)."),
	checkValidationResult,
];
