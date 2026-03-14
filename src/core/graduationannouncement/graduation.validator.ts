import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// ── Validasi cek status publik lama (tetap ada) ───────────────
export const validasiCekStatusLulus = [
	param("nomor_siswa")
		.notEmpty()
		.withMessage("Nomor ujian wajib diisi.")
		.isString()
		.withMessage("Nomor ujian harus berupa teks."),
	checkValidationResult,
];

// ── BARU: Validasi cek kelulusan siswa (nomor_siswa + tgl lahir) ─
export const validasiCekSiswa = [
	body("nomor_siswa")
		.notEmpty()
		.withMessage("Nomor Induk wajib diisi.")
		.isString()
		.withMessage("Nomor Induk harus berupa teks.")
		.isLength({ min: 5, max: 50 })
		.withMessage("Nomor Induk minimal 5 karakter."),

	body("tanggal_lahir")
		.notEmpty()
		.withMessage("Tanggal lahir wajib diisi.")
		.isString()
		.isLength({ min: 8, max: 8 })
		.withMessage("Format tanggal lahir harus YYYYMMDD (8 digit)."),

	body("tahun_ajaran")
		.notEmpty()
		.withMessage("Tahun ajaran wajib diisi.")
		.matches(/^\d{4}\/\d{4}$/)
		.withMessage("Format tahun ajaran: YYYY/YYYY."),

	checkValidationResult,
];

// ── Validasi detail (tetap ada) ───────────────────────────────
export const validasiDetailKelulusan = [
	param("kelulusan_id").isUUID(4).withMessage("ID Kelulusan harus UUID v4 yang valid."),
	checkValidationResult,
];

// ── Validasi buat kelulusan (EDIT: tambah kelas & tanggal_lahir) ─
export const validasiBuatKelulusan = [
	body("nomor_siswa")
		.notEmpty()
		.withMessage("Nomor ujian/NISN wajib diisi.")
		.isString()
		.isLength({ min: 5, max: 50 })
		.withMessage("Nomor ujian minimal 5 karakter."),

	body("nama_siswa")
		.notEmpty()
		.withMessage("Nama siswa wajib diisi.")
		.isString()
		.isLength({ min: 2, max: 255 }),

	// BARU: kelas wajib saat buat data
	body("kelas")
		.notEmpty()
		.withMessage("Kelas wajib diisi.")
		.isIn(["XII_MIPA", "XII_IPS"])
		.withMessage("Kelas harus XII_MIPA atau XII_IPS."),

	// BARU: tanggal lahir wajib saat buat data (format ISO dari input date HTML)
	body("tanggal_lahir")
		.notEmpty()
		.withMessage("Tanggal lahir siswa wajib diisi.")
		.isISO8601()
		.withMessage("Format tanggal lahir tidak valid."),

	body("status_lulus")
		.notEmpty()
		.withMessage("Status kelulusan wajib ditentukan.")
		.isBoolean()
		.withMessage("Status lulus harus true atau false."),

	body("tahun_ajaran")
		.notEmpty()
		.withMessage("Tahun ajaran wajib diisi.")
		.matches(/^\d{4}\/\d{4}$/)
		.withMessage("Format: YYYY/YYYY."),

	body("jenjang_id")
		.notEmpty()
		.withMessage("Jenjang ID wajib diisi.")
		.isUUID(4)
		.withMessage("Jenjang ID harus UUID v4."),

	body("keterangan").optional({ nullable: true }).isString(),

	checkValidationResult,
];

// ── Validasi edit kelulusan (EDIT: tambah kelas & tanggal_lahir) ─
export const validasiEditKelulusan = [
	param("kelulusan_id").isUUID(4).withMessage("ID Kelulusan harus UUID v4 yang valid."),

	body("nomor_siswa").optional({ checkFalsy: true }).isString().isLength({ min: 5, max: 50 }),

	body("nama_siswa").optional({ checkFalsy: true }).isString(),

	// BARU
	body("kelas")
		.optional()
		.isIn(["XII_MIPA", "XII_IPS"])
		.withMessage("Kelas harus XII_MIPA atau XII_IPS."),

	// BARU
	body("tanggal_lahir").optional().isISO8601().withMessage("Format tanggal lahir tidak valid."),

	body("status_lulus").optional().isBoolean(),

	body("tahun_ajaran")
		.optional({ checkFalsy: true })
		.matches(/^\d{4}\/\d{4}$/)
		.withMessage("Format tahun ajaran: YYYY/YYYY."),

	body("jenjang_id").optional({ checkFalsy: true }).isUUID(4),

	body("editor_user_id").optional({ nullable: true }).isUUID(4),

	checkValidationResult,
];

// ── Validasi hapus (tetap sama) ───────────────────────────────
export const validasiHapusKelulusan = [
	param("kelulusan_id").isUUID(4).withMessage("ID Kelulusan tidak valid."),
	checkValidationResult,
];
