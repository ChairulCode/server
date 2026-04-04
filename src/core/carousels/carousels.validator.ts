import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// UUID Validation Regex (Standard v4)
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// --- Validasi ID Parameter (UUID) ---
const validasiIdCarouselParam = [
	param("carousel_id")
		.exists()
		.withMessage("ID Carousel wajib disertakan di parameter.")
		.isUUID(4)
		.withMessage("ID Carousel harus berupa UUID v4 yang valid."),
	checkValidationResult,
];

// ====================================================
// 1. VALIDASI BUAT CAROUSEL (POST)
// ====================================================

export const validasiBuatCarousel = [
	// Judul: Wajib diisi, string, min 5, max 255
	body("judul")
		.notEmpty()
		.withMessage("Judul wajib diisi.")
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	// Urutan: Wajib diisi, harus integer unik positif
	body("urutan")
		.notEmpty()
		.withMessage("Urutan wajib diisi.")
		.optional({ checkFalsy: true })
		.isInt({ min: 1 })
		.withMessage("Urutan harus berupa angka integer positif.")
		.toInt(),

	// Konten: Wajib diisi, string, min 10 karakter
	body("konten")
		.notEmpty()
		.withMessage("Konten wajib diisi.")
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 10 })
		.withMessage("Konten minimal 10 karakter."),

	// Path Gambar: Wajib diisi (asumsi path/URL), string
	body("path_gambar")
		.notEmpty()
		.withMessage("Path gambar wajib diisi.")
		.isString()
		.withMessage("Path gambar harus berupa teks."),

	// Tanggal Publikasi: Wajib diisi, harus valid ISO 8601
	body("tanggal_publikasi")
		.notEmpty()
		.withMessage("Tanggal publikasi wajib diisi.")
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	// is_published & is_featured: Opsional, harus boolean
	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false).")
		.toBoolean(),

	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("is_featured harus berupa boolean (true/false).")
		.toBoolean(),

	// Penulis ID (FK): Wajib diisi, UUID
	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	// Editor ID (FK): Opsional, UUID
	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

	// Jenjang ID (FK 1:M): Opsional/Nullable, UUID
	body("jenjang_id")
		.optional({ nullable: true })
		.custom((value: string | null) => {
			if (value === null) return true;
			if (value && !value.match(uuidV4Regex)) {
				throw new Error("Jenjang ID harus berupa UUID v4 yang valid.");
			}
			return true;
		}),

	checkValidationResult,
];

// ====================================================
// 2. VALIDASI EDIT CAROUSEL (PUT/PATCH)
// ====================================================

export const validasiEditCarousel = [
	...validasiIdCarouselParam, // Memastikan ID di params valid

	// Judul: Opsional, string, min 5, max 255
	body("judul")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Judul harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Judul minimal 5 karakter dan maksimal 255 karakter."),

	// Urutan: Opsional, integer positif
	body("urutan")
		.optional({ checkFalsy: true })
		.isInt({ min: 1 })
		.withMessage("Urutan harus berupa angka integer positif.")
		.toInt(),

	// Konten: Opsional, string, min 10 karakter
	body("konten")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Konten harus berupa teks.")
		.isLength({ min: 10 })
		.withMessage("Konten minimal 10 karakter."),

	// Path Gambar: Opsional, string
	body("path_gambar")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Path gambar harus berupa teks."),

	// Tanggal Publikasi: Opsional, valid ISO 8601
	body("tanggal_publikasi")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate()
		.withMessage("Format tanggal publikasi tidak valid (gunakan format ISO 8601)."),

	// Status Boolean
	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false).")
		.toBoolean(),

	body("is_featured")
		.optional()
		.isBoolean()
		.withMessage("is_featured harus berupa boolean (true/false).")
		.toBoolean(),

	// Penulis ID (FK): Opsional, UUID
	body("penulis_user_id")
		.optional({ checkFalsy: true })
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	// Editor ID (FK): Opsional/Nullable, UUID
	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

	// Jenjang ID (FK 1:M): Opsional/Nullable, UUID
	body("jenjang_id")
		.optional({ nullable: true })
		.custom((value: string | null) => {
			if (value === null) return true;
			if (value && !value.match(uuidV4Regex)) {
				throw new Error("Jenjang ID harus berupa UUID v4 yang valid.");
			}
			return true;
		}),

	checkValidationResult,
];

// ====================================================
// 3. VALIDASI AMBIL DETAIL (GET /:id) & HAPUS (DELETE /:id)
// ====================================================

export const validasiAmbilDetailCarousel = validasiIdCarouselParam;

export const validasiHapusCarousel = validasiIdCarouselParam;
