// src/core/matapelajaran/matapelajaran.validator.ts

import { body, param, query } from "express-validator";

// Hardcode string array — tidak import dari Prisma
// Nilai harus identik dengan enum Tingkatan di schema.prisma
const VALID_TINGKATAN = [
	"PG_TK",
	"SD_KELAS_RENDAH",
	"SD_KELAS_TINGGI",
	"SMP",
	"SMA_MIPA",
	"SMA_IPS",
] as const;

// ── GET ?kelas=xxx ────────────────────────────────────────────────────────────

export const validateGetByKelas = [
	query("kelas")
		.notEmpty()
		.withMessage("Query parameter 'kelas' wajib diisi")
		.isString()
		.withMessage("Kelas harus berupa string")
		.trim()
		.isLength({ min: 2, max: 20 })
		.withMessage("Kelas harus 2–20 karakter"),
];

// ── GET /tingkatan/:tingkatan ─────────────────────────────────────────────────

export const validateGetByTingkatan = [
	param("tingkatan")
		.notEmpty()
		.withMessage("Tingkatan wajib diisi")
		.isIn([...VALID_TINGKATAN])
		.withMessage(`Tingkatan harus salah satu dari: ${VALID_TINGKATAN.join(", ")}`),
];

// ── POST / ────────────────────────────────────────────────────────────────────

export const validateCreateMapel = [
	body("kode")
		.notEmpty()
		.withMessage("Kode wajib diisi")
		.isString()
		.withMessage("Kode harus string")
		.trim()
		.matches(/^[A-Z0-9\-]+$/)
		.withMessage("Kode hanya boleh huruf kapital, angka, tanda hubung"),

	body("nama")
		.notEmpty()
		.withMessage("Nama mapel wajib diisi")
		.isString()
		.withMessage("Nama harus string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama harus 2–100 karakter"),

	body("tingkatan")
		.notEmpty()
		.withMessage("Tingkatan wajib diisi")
		.isIn([...VALID_TINGKATAN])
		.withMessage(`Tingkatan harus salah satu dari: ${VALID_TINGKATAN.join(", ")}`),

	body("urutan")
		.notEmpty()
		.withMessage("Urutan wajib diisi")
		.isInt({ min: 1, max: 99 })
		.withMessage("Urutan harus angka 1–99")
		.toInt(),
];

// ── PUT /:id ──────────────────────────────────────────────────────────────────

export const validateUpdateMapel = [
	param("id").notEmpty().withMessage("ID wajib diisi").isString().withMessage("ID harus string"),

	body("nama")
		.optional()
		.isString()
		.withMessage("Nama harus string")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Nama harus 2–100 karakter"),

	body("urutan")
		.optional()
		.isInt({ min: 1, max: 99 })
		.withMessage("Urutan harus angka 1–99")
		.toInt(),

	body("isActive").optional().isBoolean().withMessage("isActive harus boolean").toBoolean(),
];

// ── DELETE /:id ───────────────────────────────────────────────────────────────

export const validateMapelId = [
	param("id").notEmpty().withMessage("ID wajib diisi").isString().withMessage("ID harus string"),
];
