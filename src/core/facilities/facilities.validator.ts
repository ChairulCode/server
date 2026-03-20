import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// ─── GET DETAIL ───────────────────────────────────────────────────────────────
export const validasiGetFasilitas = [
	param("fasilitas_id")
		.exists()
		.withMessage("ID Fasilitas wajib disertakan.")
		.isUUID()
		.withMessage("ID Fasilitas harus berupa UUID."),
	checkValidationResult,
];

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const validasiBuatFasilitas = [
	body("nama")
		.notEmpty()
		.withMessage("Nama fasilitas wajib diisi.")
		.isString()
		.withMessage("Nama harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Nama minimal 2 dan maksimal 255 karakter."),

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("icon")
		.optional({ nullable: true })
		.isString()
		.withMessage("Icon harus berupa teks.")
		.isLength({ max: 100 })
		.withMessage("Icon maksimal 100 karakter."),

	body("urutan")
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage("Urutan harus berupa angka positif."),

	body("is_active").optional().isBoolean().withMessage("is_active harus berupa boolean."),

	checkValidationResult,
];

// ─── UPDATE PUT ───────────────────────────────────────────────────────────────
export const validasiPutFasilitas = [
	param("fasilitas_id")
		.exists()
		.withMessage("ID Fasilitas wajib disertakan.")
		.isUUID()
		.withMessage("ID Fasilitas harus berupa UUID."),

	body("nama")
		.notEmpty()
		.withMessage("Nama fasilitas wajib diisi.")
		.isString()
		.withMessage("Nama harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Nama minimal 2 dan maksimal 255 karakter."),

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("icon")
		.optional({ nullable: true })
		.isString()
		.withMessage("Icon harus berupa teks.")
		.isLength({ max: 100 })
		.withMessage("Icon maksimal 100 karakter."),

	body("urutan")
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage("Urutan harus berupa angka positif."),

	body("is_active").optional().isBoolean().withMessage("is_active harus berupa boolean."),

	checkValidationResult,
];

// ─── UPDATE PATCH ─────────────────────────────────────────────────────────────
export const validasiPatchFasilitas = [
	param("fasilitas_id")
		.exists()
		.withMessage("ID Fasilitas wajib disertakan.")
		.isUUID()
		.withMessage("ID Fasilitas harus berupa UUID."),

	body("nama")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Nama harus berupa teks.")
		.isLength({ min: 2, max: 255 })
		.withMessage("Nama minimal 2 dan maksimal 255 karakter."),

	body("deskripsi")
		.optional({ nullable: true })
		.isString()
		.withMessage("Deskripsi harus berupa teks."),

	body("icon")
		.optional({ nullable: true })
		.isString()
		.withMessage("Icon harus berupa teks.")
		.isLength({ max: 100 })
		.withMessage("Icon maksimal 100 karakter."),

	body("urutan")
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage("Urutan harus berupa angka positif."),

	body("is_active").optional().isBoolean().withMessage("is_active harus berupa boolean."),

	checkValidationResult,
];

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const validasiHapusFasilitas = [
	param("fasilitas_id").isUUID().withMessage("ID Fasilitas harus berupa UUID."),
	checkValidationResult,
];

// ─── UPLOAD GAMBAR ────────────────────────────────────────────────────────────
export const validasiUploadGambar = [
	param("fasilitas_id").isUUID().withMessage("ID Fasilitas harus berupa UUID."),
	checkValidationResult,
];

// ─── HAPUS GAMBAR ─────────────────────────────────────────────────────────────
export const validasiHapusGambar = [
	param("fasilitas_id").isUUID().withMessage("ID Fasilitas harus berupa UUID."),
	param("gambar_id").isUUID().withMessage("ID Gambar harus berupa UUID."),
	checkValidationResult,
];
