import { body, param } from "express-validator";

export const validateOrangTuaId = [
	param("id")
		.notEmpty()
		.withMessage("ID orang tua wajib diisi")
		.isString()
		.withMessage("ID harus berupa string"),
];

export const validateSiswaIdParam = [
	param("siswaId")
		.notEmpty()
		.withMessage("ID siswa wajib diisi")
		.isString()
		.withMessage("ID siswa harus berupa string"),
];

const bodyRules = [
	body("namaAyah")
		.notEmpty()
		.withMessage("Nama ayah wajib diisi")
		.isString()
		.withMessage("Nama ayah harus berupa string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama ayah harus 2-100 karakter"),

	body("namaIbu")
		.notEmpty()
		.withMessage("Nama ibu wajib diisi")
		.isString()
		.withMessage("Nama ibu harus berupa string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama ibu harus 2-100 karakter"),

	body("pekerjaanAyah")
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.withMessage("Pekerjaan ayah harus berupa string")
		.trim()
		.isLength({ max: 100 })
		.withMessage("Pekerjaan ayah maksimal 100 karakter"),

	body("pekerjaanIbu")
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.withMessage("Pekerjaan ibu harus berupa string")
		.trim()
		.isLength({ max: 100 })
		.withMessage("Pekerjaan ibu maksimal 100 karakter"),

	body("teleponAyah")
		.optional({ nullable: true, checkFalsy: true })
		.isMobilePhone("id-ID")
		.withMessage("Format telepon ayah tidak valid"),

	body("teleponIbu")
		.optional({ nullable: true, checkFalsy: true })
		.isMobilePhone("id-ID")
		.withMessage("Format telepon ibu tidak valid"),

	body("alamatOrangTua")
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.withMessage("Alamat harus berupa string")
		.trim()
		.isLength({ max: 255 })
		.withMessage("Alamat maksimal 255 karakter"),
];

export const validateCreateOrangTua = [...validateSiswaIdParam, ...bodyRules];

export const validateUpdateOrangTua = [
	...validateOrangTuaId,
	body("namaAyah")
		.optional()
		.isString()
		.withMessage("Nama ayah harus berupa string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama ayah harus 2-100 karakter"),
	body("namaIbu")
		.optional()
		.isString()
		.withMessage("Nama ibu harus berupa string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama ibu harus 2-100 karakter"),
	body("pekerjaanAyah")
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.trim()
		.isLength({ max: 100 }),
	body("pekerjaanIbu")
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.trim()
		.isLength({ max: 100 }),
	body("teleponAyah")
		.optional({ nullable: true, checkFalsy: true })
		.isMobilePhone("id-ID")
		.withMessage("Format telepon ayah tidak valid"),
	body("teleponIbu")
		.optional({ nullable: true, checkFalsy: true })
		.isMobilePhone("id-ID")
		.withMessage("Format telepon ibu tidak valid"),
	body("alamatOrangTua")
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.trim()
		.isLength({ max: 255 }),
];
