import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// Fungsi untuk memeriksa apakah array jenjang_id valid (M:M)
const validasiJenjangArray = body("jenjang_ids")
	.optional({ nullable: true })
	.isArray()
	.withMessage("Jenjang ID harus berupa array.")
	.custom((value: string[]) => {
		if (value && value.length > 0) {
			// Memastikan setiap elemen di array adalah UUID v4 yang valid
			const invalidIds = value.filter(
				(id) =>
					!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			);
			if (invalidIds.length > 0) {
				throw new Error("Semua Jenjang ID di array harus berupa UUID v4 yang valid.");
			}
		}
		return true;
	});

// --- Validasi GET Prestasi (Menggunakan UUID) ---
export const validasiGetPrestasi = [
	param("prestasi_id")
		.exists()
		.withMessage("ID Prestasi wajib disertakan di parameter.")
		.isUUID(4)
		.withMessage("ID Prestasi harus berupa UUID (String)."),
	checkValidationResult,
];

// --- Validasi CREATE Prestasi (Menggunakan UUID & M:M) ---
export const validasiBuatPrestasi = [
	body("judul")
		.notEmpty()
		.withMessage("Judul prestasi wajib diisi.")
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	body("deskripsi") // Menggantikan 'ringkasan'
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi (ringkasan) harus berupa teks."),

	body("konten") // Menggantikan 'konten_lengkap'
		.notEmpty()
		.withMessage("Isi konten wajib diisi.")
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 1 })
		.withMessage("Konten minimal 50 karakter."),

	// Hapus kategori_id (FK tunggal), ganti dengan validasi array Jenjang:
	validasiJenjangArray,

	body("path_gambar") // Menggantikan 'gambar_utama'
		.optional({ nullable: true })
		.isString()
		.withMessage("Path gambar utama harus berupa teks."),

	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Tanggal publikasi harus dalam format tanggal/waktu yang valid (ISO 8601)."),

	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID (String)."),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID (String)."),

	checkValidationResult,
];

// --- Validasi UPDATE (PUT) Prestasi ---
export const validasiPutPrestasi = [
	param("prestasi_id")
		.exists()
		.withMessage("ID Prestasi wajib disertakan di parameter.")
		.isUUID(4)
		.withMessage("ID Prestasi harus berupa UUID (String)."),

	body("judul")
		.notEmpty()
		.withMessage("Judul wajib diisi.")
		.isString()
		.isLength({ min: 2, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	body("konten") // Menggantikan konten_lengkap
		.notEmpty()
		.withMessage("Isi konten wajib diisi.")
		.isString()
		.isLength({ min: 1 })
		.withMessage("Konten minimal 50 karakter."),

	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Tanggal publikasi harus dalam format tanggal/waktu yang valid (ISO 8601)."),

	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID (String)."),

	// Hapus kategori_id, ganti dengan Jenjang Array
	validasiJenjangArray,

	body("deskripsi") // Menggantikan ringkasan
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi (ringkasan) harus berupa teks."),

	body("path_gambar") // Menggantikan gambar_utama
		.optional({ nullable: true })
		.isString()
		.withMessage("Path Gambar Utama harus berupa teks."),


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
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID (String)."),

	checkValidationResult,
];

// --- Validasi PATCH Prestasi ---
export const validasiPatchPrestasi = [
	param("prestasi_id")
		.exists()
		.withMessage("ID Prestasi wajib disertakan di parameter.")
		.isUUID(4)
		.withMessage("ID Prestasi harus berupa UUID (String)."),

	body("judul")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	body("konten") // Menggantikan konten_lengkap
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 1 })
		.withMessage("Konten minimal 50 karakter."),

	body("tanggal_publikasi")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate()
		.withMessage("Tanggal publikasi harus dalam format tanggal/waktu yang valid (ISO 8601)."),

	body("penulis_user_id")
		.optional({ checkFalsy: true })
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID (String)."),

	// Hapus kategori_id, ganti dengan Jenjang Array
	validasiJenjangArray,

	body("deskripsi") // Menggantikan ringkasan
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi (ringkasan) harus berupa teks."),

	body("path_gambar") // Menggantikan gambar_utama
		.optional({ nullable: true })
		.isString()
		.withMessage("Path Gambar Utama harus berupa teks."),

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
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID (String)."),

	checkValidationResult,
];

// --- Validasi DELETE Prestasi ---
export const validasiHapusPrestasi = [
	param("prestasi_id").isUUID(4).withMessage("ID yang dihapus harus berupa UUID (String)."),
	checkValidationResult,
];
