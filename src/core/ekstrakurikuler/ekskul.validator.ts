import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

export const validasiGetEkskul = [
	param("ekskul_id").exists().isUUID().withMessage("ID harus berupa UUID."),
	checkValidationResult,
];

export const validasiBuatEkskul = [
	body("nama")
		.notEmpty()
		.isString()
		.isLength({ min: 2, max: 255 })
		.withMessage("Nama wajib diisi, min 2 max 255 karakter."),
	body("deskripsi").optional({ nullable: true }).isString(),
	body("kategori").optional({ nullable: true }).isString().isLength({ max: 100 }),
	body("hari_latihan").optional({ nullable: true }).isString().isLength({ max: 255 }),
	body("icon").optional({ nullable: true }).isString().isLength({ max: 100 }),
	body("urutan").optional({ nullable: true }).isInt({ min: 1 }),
	body("is_active").optional().isBoolean(),
	checkValidationResult,
];

export const validasiPutEkskul = [
	param("ekskul_id").isUUID().withMessage("ID harus berupa UUID."),
	body("nama").notEmpty().isString().isLength({ min: 2, max: 255 }),
	body("deskripsi").optional({ nullable: true }).isString(),
	body("kategori").optional({ nullable: true }).isString().isLength({ max: 100 }),
	body("hari_latihan").optional({ nullable: true }).isString().isLength({ max: 255 }),
	body("icon").optional({ nullable: true }).isString().isLength({ max: 100 }),
	body("urutan").optional({ nullable: true }).isInt({ min: 1 }),
	body("is_active").optional().isBoolean(),
	checkValidationResult,
];

export const validasiPatchEkskul = [
	param("ekskul_id").isUUID().withMessage("ID harus berupa UUID."),
	body("nama").optional({ checkFalsy: true }).isString().isLength({ min: 2, max: 255 }),
	body("deskripsi").optional({ nullable: true }).isString(),
	body("kategori").optional({ nullable: true }).isString().isLength({ max: 100 }),
	body("hari_latihan").optional({ nullable: true }).isString().isLength({ max: 255 }),
	body("icon").optional({ nullable: true }).isString().isLength({ max: 100 }),
	body("urutan").optional({ nullable: true }).isInt({ min: 1 }),
	body("is_active").optional().isBoolean(),
	checkValidationResult,
];

export const validasiHapusEkskul = [
	param("ekskul_id").isUUID().withMessage("ID harus berupa UUID."),
	checkValidationResult,
];

export const validasiUploadGambar = [
	param("ekskul_id").isUUID().withMessage("ID harus berupa UUID."),
	checkValidationResult,
];

export const validasiHapusGambar = [
	param("ekskul_id").isUUID().withMessage("ID harus berupa UUID."),
	param("gambar_id").isUUID().withMessage("ID Gambar harus berupa UUID."),
	checkValidationResult,
];
