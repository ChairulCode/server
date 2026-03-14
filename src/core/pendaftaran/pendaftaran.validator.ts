import { body, param, query } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

/* ====================================================
   CONSTANTS
==================================================== */

const KELAS_OPTIONS = ["PG", "TK A", "TK B", "SD Kelas I", "SMP Kelas VII", "SMA Kelas X"] as const;

const JENIS_KELAMIN = ["laki-laki", "perempuan"] as const;

const AGAMA_OPTIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] as const;

const STATUS_ANAK = ["anak kandung", "anak tiri", "anak angkat"] as const;

const TINGGAL_BERSAMA = ["Orang Tua", "Wali", "Kost"] as const;

const PENDIDIKAN_OPTIONS = ["SD", "SMP", "SMA", "D3", "S1", "S2", "S3"] as const;

const GOLONGAN_DARAH = ["A", "B", "AB", "O"] as const;

const STATUS_PENDAFTARAN = ["pending", "approved", "rejected"] as const;

/* ====================================================
   PARAM VALIDATOR (UUID)
==================================================== */

const validasiIdPendaftaranParam = [
	param("pendaftaran_id")
		.exists()
		.withMessage("ID Pendaftaran wajib disertakan.")
		.isUUID(4)
		.withMessage("ID Pendaftaran harus berupa UUID v4 yang valid."),
	checkValidationResult,
];

/* ====================================================
   1. VALIDASI BUAT PENDAFTARAN (POST)
==================================================== */

export const validasiBuatPendaftaran = [
	// ========== DATA SISWA ==========
	body("namaSiswa")
		.notEmpty()
		.withMessage("Nama siswa wajib diisi.")
		.trim()
		.isLength({ min: 3, max: 100 })
		.withMessage("Nama siswa minimal 3 dan maksimal 100 karakter."),

	body("kelas")
		.notEmpty()
		.withMessage("Kelas wajib dipilih.")
		.isIn(KELAS_OPTIONS)
		.withMessage(`Kelas harus salah satu dari: ${KELAS_OPTIONS.join(", ")}`),

	body("tempatLahir")
		.notEmpty()
		.withMessage("Tempat lahir wajib diisi.")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("Tempat lahir minimal 2 dan maksimal 100 karakter."),

	body("tanggalLahir")
		.notEmpty()
		.withMessage("Tanggal lahir wajib diisi.")
		.isISO8601()
		.withMessage("Format tanggal lahir tidak valid (gunakan YYYY-MM-DD)."),

	body("jenisKelamin")
		.notEmpty()
		.withMessage("Jenis kelamin wajib dipilih.")
		.isIn(JENIS_KELAMIN)
		.withMessage(`Jenis kelamin harus: ${JENIS_KELAMIN.join(" atau ")}`),

	body("belajarAgama")
		.notEmpty()
		.withMessage("Agama wajib dipilih.")
		.isIn(AGAMA_OPTIONS)
		.withMessage(`Agama harus salah satu dari: ${AGAMA_OPTIONS.join(", ")}`),

	body("golonganDarah")
		.optional({ nullable: true })
		.isIn(GOLONGAN_DARAH)
		.withMessage(`Golongan darah harus: ${GOLONGAN_DARAH.join(", ")}`),

	body("anakKe")
		.notEmpty()
		.withMessage("Anak ke wajib diisi.")
		.isInt({ min: 1 })
		.withMessage("Anak ke harus angka minimal 1.")
		.toInt(),

	body("jumlahSaudara")
		.notEmpty()
		.withMessage("Jumlah saudara wajib diisi.")
		.isInt({ min: 0 })
		.withMessage("Jumlah saudara harus angka minimal 0.")
		.toInt(),

	body("status")
		.notEmpty()
		.withMessage("Status anak wajib dipilih.")
		.trim() // <-- Menghapus spasi di awal/akhir value
		.isIn([...STATUS_ANAK]) // <-- Menggunakan variabel agar TS tidak crash
		.withMessage(`Status harus: ${STATUS_ANAK.join(", ")}`),

	body("alamatSiswa")
		.notEmpty()
		.withMessage("Alamat siswa wajib diisi.")
		.trim()
		.isLength({ min: 10, max: 500 })
		.withMessage("Alamat siswa minimal 10 dan maksimal 500 karakter."),

	body("telpSiswa")
		.notEmpty()
		.withMessage("Telepon siswa wajib diisi.")
		.matches(/^(\+62|62|0)[0-9]{9,12}$/)
		.withMessage("Format nomor telepon tidak valid (contoh: 08123456789)."),

	body("tinggalBersama")
		.notEmpty()
		.withMessage("Tinggal bersama wajib dipilih.")
		.isIn(TINGGAL_BERSAMA)
		.withMessage(`Tinggal bersama harus: ${TINGGAL_BERSAMA.join(", ")}`),

	body("lulusanDariSekolah")
		.optional({ nullable: true })
		.trim()
		.isLength({ max: 200 })
		.withMessage("Nama sekolah maksimal 200 karakter."),

	body("nisn")
		.optional({ nullable: true })
		.trim()
		.isLength({ min: 10, max: 10 })
		.withMessage("NISN harus 10 digit.")
		.isNumeric()
		.withMessage("NISN harus berupa angka."),

	// ========== DATA IJAZAH (OPTIONAL) ==========
	body("nomorIjazah").optional({ nullable: true }).trim().isLength({ max: 50 }),

	body("tglIjazah")
		.optional({ nullable: true })
		.isISO8601()
		.withMessage("Format tanggal ijazah tidak valid."),

	body("tahunIjazah")
		.optional({ nullable: true })
		.isInt({ min: 2000, max: new Date().getFullYear() })
		.withMessage("Tahun ijazah tidak valid.")
		.toInt(),

	body("jumlahNilaiUS")
		.optional({ nullable: true })
		.isFloat({ min: 0 })
		.withMessage("Jumlah nilai US harus angka positif.")
		.toFloat(),

	body("pindahanDariSekolah").optional({ nullable: true }).trim().isLength({ max: 200 }),

	body("alamatSekolahAsal").optional({ nullable: true }).trim().isLength({ max: 500 }),
	body("emailOrangTua")
		.notEmpty()
		.withMessage("Email orang tua wajib diisi.")
		.isEmail()
		.withMessage("Format email tidak valid.")
		.normalizeEmail(), // Membersihkan format email

	// ========== DATA AYAH ==========
	body("namaAyah")
		.notEmpty()
		.withMessage("Nama ayah wajib diisi.")
		.trim()
		.isLength({ min: 3, max: 100 })
		.withMessage("Nama ayah minimal 3 dan maksimal 100 karakter."),

	body("tempatLahirAyah")
		.notEmpty()
		.withMessage("Tempat lahir ayah wajib diisi.")
		.trim()
		.isLength({ min: 2, max: 100 }),

	body("tanggalLahirAyah")
		.notEmpty()
		.withMessage("Tanggal lahir ayah wajib diisi.")
		.isISO8601()
		.withMessage("Format tanggal lahir ayah tidak valid."),

	body("agamaAyah")
		.notEmpty()
		.withMessage("Agama ayah wajib dipilih.")
		.isIn(AGAMA_OPTIONS)
		.withMessage(`Agama harus: ${AGAMA_OPTIONS.join(", ")}`),

	body("pendidikanAyah")
		.notEmpty()
		.withMessage("Pendidikan ayah wajib dipilih.")
		.isIn(PENDIDIKAN_OPTIONS)
		.withMessage(`Pendidikan harus: ${PENDIDIKAN_OPTIONS.join(", ")}`),

	body("alamatAyah")
		.notEmpty()
		.withMessage("Alamat ayah wajib diisi.")
		.trim()
		.isLength({ min: 10, max: 500 }),

	body("pekerjaanAyah")
		.notEmpty()
		.withMessage("Pekerjaan ayah wajib diisi.")
		.trim()
		.isLength({ min: 2, max: 100 }),

	body("telpAyah")
		.notEmpty()
		.withMessage("Telepon ayah wajib diisi.")
		.matches(/^(\+62|62|0)[0-9]{9,12}$/)
		.withMessage("Format nomor telepon ayah tidak valid."),

	// ========== DATA IBU ==========
	body("namaIbu")
		.notEmpty()
		.withMessage("Nama ibu wajib diisi.")
		.trim()
		.isLength({ min: 3, max: 100 })
		.withMessage("Nama ibu minimal 3 dan maksimal 100 karakter."),

	body("tempatLahirIbu")
		.notEmpty()
		.withMessage("Tempat lahir ibu wajib diisi.")
		.trim()
		.isLength({ min: 2, max: 100 }),

	body("tanggalLahirIbu")
		.notEmpty()
		.withMessage("Tanggal lahir ibu wajib diisi.")
		.isISO8601()
		.withMessage("Format tanggal lahir ibu tidak valid."),

	body("agamaIbu")
		.notEmpty()
		.withMessage("Agama ibu wajib dipilih.")
		.isIn(AGAMA_OPTIONS)
		.withMessage(`Agama harus: ${AGAMA_OPTIONS.join(", ")}`),

	body("pendidikanIbu")
		.notEmpty()
		.withMessage("Pendidikan ibu wajib dipilih.")
		.isIn(PENDIDIKAN_OPTIONS)
		.withMessage(`Pendidikan harus: ${PENDIDIKAN_OPTIONS.join(", ")}`),

	body("alamatIbu")
		.notEmpty()
		.withMessage("Alamat ibu wajib diisi.")
		.trim()
		.isLength({ min: 10, max: 500 }),

	body("pekerjaanIbu")
		.notEmpty()
		.withMessage("Pekerjaan ibu wajib diisi.")
		.trim()
		.isLength({ min: 2, max: 100 }),

	body("telpIbu")
		.notEmpty()
		.withMessage("Telepon ibu wajib diisi.")
		.matches(/^(\+62|62|0)[0-9]{9,12}$/)
		.withMessage("Format nomor telepon ibu tidak valid."),

	checkValidationResult,
];

/* ====================================================
   2. VALIDASI UPDATE STATUS
==================================================== */

export const validasiUpdateStatus = [
	...validasiIdPendaftaranParam,

	body("status")
		.notEmpty()
		.withMessage("Status wajib diisi.")
		.isIn(STATUS_PENDAFTARAN)
		.withMessage(`Status harus: ${STATUS_PENDAFTARAN.join(", ")}`),

	checkValidationResult,
];

/* ====================================================
   3. VALIDASI QUERY PARAMS (GET ALL)
==================================================== */

export const validasiQueryPendaftaran = [
	query("page").optional().isInt({ min: 1 }).withMessage("Page harus angka positif.").toInt(),

	query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit harus 1-100.").toInt(),

	query("status")
		.optional()
		.isIn(STATUS_PENDAFTARAN)
		.withMessage(`Status harus: ${STATUS_PENDAFTARAN.join(", ")}`),

	query("kelas")
		.optional()
		.isIn(KELAS_OPTIONS)
		.withMessage(`Kelas harus: ${KELAS_OPTIONS.join(", ")}`),

	query("search").optional().trim().isLength({ min: 1 }).withMessage("Search tidak boleh kosong."),

	checkValidationResult,
];

/* ====================================================
   4. VALIDASI HAPUS & DETAIL
==================================================== */

export const validasiAmbilDetailPendaftaran = validasiIdPendaftaranParam;
export const validasiHapusPendaftaran = validasiIdPendaftaranParam;

/* ====================================================
   EXPORT GROUP
==================================================== */

export const pendaftaranValidator = {
	create: validasiBuatPendaftaran,
	updateStatus: validasiUpdateStatus,
	query: validasiQueryPendaftaran,
	detail: validasiAmbilDetailPendaftaran,
	delete: validasiHapusPendaftaran,
};
