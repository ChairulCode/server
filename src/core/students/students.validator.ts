// src/modules/siswa/siswa.validator.ts

import { body, param, query } from "express-validator";

// ─── Reusable param validator ──────────────────────────────────────────────

export const validateSiswaId = [
	param("id")
		.notEmpty()
		.withMessage("ID siswa wajib diisi")
		.isString()
		.withMessage("ID siswa harus berupa string"),
];

// ─── Query filter validator ────────────────────────────────────────────────

export const validateSiswaQuery = [
	query("nama").optional().isString().withMessage("Nama harus berupa string").trim(),
	query("nisn").optional().isString().withMessage("NISN harus berupa string").trim(),
	query("kelas").optional().isString().withMessage("Kelas harus berupa string").trim(),
	query("jenisKelamin").optional().isIn(["L", "P"]).withMessage("Jenis kelamin harus L atau P"),
	query("status")
		.optional()
		.isIn(["AKTIF", "TIDAK_AKTIF"])
		.withMessage("Status harus AKTIF atau TIDAK_AKTIF"),
	query("page").optional().isInt({ min: 1 }).withMessage("Page harus berupa angka positif").toInt(),
	query("limit")
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage("Limit harus antara 1-100")
		.toInt(),
	query("sortBy")
		.optional()
		.isIn(["nama", "nisn", "kelas", "tanggalLahir", "createdAt", "no"])
		.withMessage("sortBy tidak valid"),
	query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("sortOrder harus asc atau desc"),
];

// ─── Create validator ──────────────────────────────────────────────────────

export const validateCreateSiswa = [
	body("nama")
		.notEmpty()
		.withMessage("Nama siswa wajib diisi")
		.isString()
		.withMessage("Nama harus berupa string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama harus 2-100 karakter"),

	body("nisn")
		.notEmpty()
		.withMessage("NISN wajib diisi")
		.isString()
		.withMessage("NISN harus berupa string")
		.trim()
		.matches(/^\d{10}$/)
		.withMessage("NISN harus 10 digit angka"),

	body("alamat")
		.notEmpty()
		.withMessage("Alamat wajib diisi")
		.isString()
		.withMessage("Alamat harus berupa string")
		.trim()
		.isLength({ min: 5, max: 255 })
		.withMessage("Alamat harus 5-255 karakter"),

	body("tanggalLahir")
		.notEmpty()
		.withMessage("Tanggal lahir wajib diisi")
		.isISO8601()
		.withMessage("Format tanggal lahir tidak valid (gunakan YYYY-MM-DD)")
		.toDate(),

	body("jenisKelamin")
		.notEmpty()
		.withMessage("Jenis kelamin wajib diisi")
		.isIn(["L", "P"])
		.withMessage("Jenis kelamin harus L (Laki-laki) atau P (Perempuan)"),

	body("kelas")
		.notEmpty()
		.withMessage("Kelas wajib diisi")
		.isString()
		.withMessage("Kelas harus berupa string")
		.trim()
		.isLength({ min: 2, max: 20 })
		.withMessage("Kelas harus 2-20 karakter"),

	body("email")
		.optional({ nullable: true, checkFalsy: true })
		.isEmail()
		.withMessage("Format email tidak valid")
		.normalizeEmail(),

	body("status")
		.optional()
		.isIn(["AKTIF", "TIDAK_AKTIF"])
		.withMessage("Status harus AKTIF atau TIDAK_AKTIF"),

	// ✅ TAMBAH: validasi jenjang_id wajib diisi dan harus UUID v4
	body("jenjang_id")
		.notEmpty()
		.withMessage("Jenjang ID wajib diisi")
		.isUUID(4)
		.withMessage("Jenjang ID harus berupa UUID v4 yang valid"),
];

// ─── Update validator (semua field optional) ──────────────────────────────

export const validateUpdateSiswa = [
	...validateSiswaId,

	body("nama")
		.optional()
		.isString()
		.withMessage("Nama harus berupa string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama harus 2-100 karakter"),

	body("nisn")
		.optional()
		.isString()
		.withMessage("NISN harus berupa string")
		.trim()
		.matches(/^\d{10}$/)
		.withMessage("NISN harus 10 digit angka"),

	body("alamat")
		.optional()
		.isString()
		.withMessage("Alamat harus berupa string")
		.trim()
		.isLength({ min: 5, max: 255 })
		.withMessage("Alamat harus 5-255 karakter"),

	body("tanggalLahir")
		.optional()
		.isISO8601()
		.withMessage("Format tanggal lahir tidak valid (gunakan YYYY-MM-DD)")
		.toDate(),

	body("jenisKelamin").optional().isIn(["L", "P"]).withMessage("Jenis kelamin harus L atau P"),

	body("kelas")
		.optional()
		.isString()
		.withMessage("Kelas harus berupa string")
		.trim()
		.isLength({ min: 2, max: 20 })
		.withMessage("Kelas harus 2-20 karakter"),

	body("email")
		.optional({ nullable: true, checkFalsy: true })
		.isEmail()
		.withMessage("Format email tidak valid")
		.normalizeEmail(),

	body("status")
		.optional()
		.isIn(["AKTIF", "TIDAK_AKTIF"])
		.withMessage("Status harus AKTIF atau TIDAK_AKTIF"),

	// ✅ TAMBAH: validasi jenjang_id optional saat update, tapi harus UUID jika diisi
	body("jenjang_id").optional().isUUID(4).withMessage("Jenjang ID harus berupa UUID v4 yang valid"),
];
