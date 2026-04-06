import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validasiIdAboutParam = [
	param("about_id")
		.exists()
		.withMessage("ID About wajib disertakan di parameter.")
		.isUUID(4)
		.withMessage("ID About harus berupa UUID v4 yang valid."),
	checkValidationResult,
];

export const validasiBuatAbout = [
	body("hero_title")
		.notEmpty()
		.withMessage("Hero title wajib diisi.")
		.isString()
		.withMessage("Hero title harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Hero title minimal 5 karakter dan maksimal 255 karakter."),

	body("hero_badge")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Hero badge harus berupa teks."),

	body("hero_subtitle")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Hero subtitle harus berupa teks."),

	body("hero_image")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Hero image harus berupa teks."),

	body("description_text")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Description text harus berupa teks."),

	body("visi_quote")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Visi quote harus berupa teks."),

	body("cta_title")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA title harus berupa teks."),

	body("cta_description")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA description harus berupa teks."),

	body("cta_button_text")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA button text harus berupa teks."),

	body("cta_button_url")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA button URL harus berupa teks."),

	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false).")
		.toBoolean(),

	body("penulis_user_id")
		.notEmpty()
		.withMessage("ID Penulis wajib diisi.")
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

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

export const validasiEditAbout = [
	...validasiIdAboutParam,

	body("hero_title")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Hero title harus berupa teks.")
		.isLength({ min: 5, max: 255 })
		.withMessage("Hero title minimal 5 karakter dan maksimal 255 karakter."),

	body("hero_badge")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Hero badge harus berupa teks."),

	body("hero_subtitle")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Hero subtitle harus berupa teks."),

	body("hero_image")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Hero image harus berupa teks."),

	body("description_text")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Description text harus berupa teks."),

	body("visi_quote")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Visi quote harus berupa teks."),

	body("cta_title")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA title harus berupa teks."),

	body("cta_description")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA description harus berupa teks."),

	body("cta_button_text")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA button text harus berupa teks."),

	body("cta_button_url")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("CTA button URL harus berupa teks."),

	body("is_published")
		.optional()
		.isBoolean()
		.withMessage("is_published harus berupa boolean (true/false).")
		.toBoolean(),

	body("penulis_user_id")
		.optional({ checkFalsy: true })
		.isUUID(4)
		.withMessage("ID Penulis harus berupa UUID v4 yang valid."),

	body("editor_user_id")
		.optional({ nullable: true })
		.isUUID(4)
		.withMessage("ID Editor harus berupa UUID v4 yang valid."),

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

export const validasiAmbilDetailAbout = validasiIdAboutParam;

export const validasiHapusAbout = validasiIdAboutParam;
