import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

/* ====================================================
   CONSTANT
==================================================== */

const SOCIAL_MEDIA_PLATFORMS = ["Facebook", "Instagram", "Youtube", "Tiktok", "Website"] as const;

/* ====================================================
   PARAM VALIDATOR (UUID)
==================================================== */

const validasiIdSocialMediaParam = [
	param("social_media_id")
		.exists()
		.withMessage("ID Social Media wajib disertakan.")
		.isUUID(4)
		.withMessage("ID Social Media harus berupa UUID v4 yang valid."),
	checkValidationResult,
];

/* ====================================================
   1. VALIDASI BUAT SOCIAL MEDIA (POST)
   ⚠️ penulis_user_id DIAMBIL DARI JWT
==================================================== */

export const validasiBuatSocialMedia = [
	// Platform
	body("platform")
		.notEmpty()
		.withMessage("Platform wajib diisi.")
		.isIn(SOCIAL_MEDIA_PLATFORMS)
		.withMessage(`Platform harus salah satu dari: ${SOCIAL_MEDIA_PLATFORMS.join(", ")}`),

	// Username
	body("username")
		.notEmpty()
		.withMessage("Username wajib diisi.")
		.isString()
		.withMessage("Username harus berupa teks.")
		.isLength({ min: 2, max: 100 })
		.withMessage("Username minimal 2 dan maksimal 100 karakter."),

	// URL
	body("url")
		.notEmpty()
		.withMessage("URL wajib diisi.")
		.isURL({ require_protocol: true })
		.withMessage("URL harus valid (contoh: https://...)."),

	// Followers (opsional)
	body("followers")
		.optional({ nullable: true })
		.isString()
		.withMessage("Followers harus berupa teks.")
		.isLength({ max: 50 })
		.withMessage("Followers maksimal 50 karakter."),

	// Status Aktif
	body("is_active")
		.optional()
		.isBoolean()
		.withMessage("is_active harus berupa boolean.")
		.toBoolean(),

	// Urutan
	body("urutan")
		.optional()
		.isInt({ min: 1 })
		.withMessage("Urutan harus berupa angka positif.")
		.toInt(),

	checkValidationResult,
];

/* ====================================================
   2. VALIDASI EDIT SOCIAL MEDIA (PUT / PATCH)
   ⚠️ editor_user_id DIAMBIL DARI JWT
==================================================== */

export const validasiEditSocialMedia = [
	...validasiIdSocialMediaParam,

	body("platform")
		.optional({ checkFalsy: true })
		.isIn(SOCIAL_MEDIA_PLATFORMS)
		.withMessage(`Platform harus salah satu dari: ${SOCIAL_MEDIA_PLATFORMS.join(", ")}`),

	body("username")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Username harus berupa teks.")
		.isLength({ min: 2, max: 100 })
		.withMessage("Username minimal 2 dan maksimal 100 karakter."),

	body("url")
		.optional({ checkFalsy: true })
		.isURL({ require_protocol: true })
		.withMessage("URL harus valid."),

	body("followers")
		.optional({ nullable: true })
		.isString()
		.withMessage("Followers harus berupa teks.")
		.isLength({ max: 50 })
		.withMessage("Followers maksimal 50 karakter."),

	body("is_active").optional().isBoolean().withMessage("is_active harus boolean.").toBoolean(),

	body("urutan")
		.optional()
		.isInt({ min: 1 })
		.withMessage("Urutan harus berupa angka positif.")
		.toInt(),

	checkValidationResult,
];

/* ====================================================
   3. VALIDASI AMBIL DETAIL & HAPUS
==================================================== */

export const validasiAmbilDetailSocialMedia = validasiIdSocialMediaParam;
export const validasiHapusSocialMedia = validasiIdSocialMediaParam;

/* ====================================================
   EXPORT GROUP (OPTIONAL)
==================================================== */

export const socialValidator = {
	create: validasiBuatSocialMedia,
	update: validasiEditSocialMedia,
	detail: validasiAmbilDetailSocialMedia,
	delete: validasiHapusSocialMedia,
};
