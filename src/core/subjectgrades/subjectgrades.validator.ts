import { body, param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

// ====================================================
// VALIDASI DETAIL & PARAMETER ID
// ====================================================
export const validasiDetailSubjectGrade = [
	// grade_id tetap UUID karena di database (Primary Key) kita masih pakai UUID
	param("grade_id").isUUID(4).withMessage("ID Nilai harus berupa UUID v4 yang valid."),
	checkValidationResult,
];

// ====================================================
// VALIDASI BUAT DATA NILAI (CREATE)
// ====================================================
export const validasiBuatSubjectGrade = [
	// 1. Tahun Ajaran (Wajib, Format: 2024/2025)
	body("tahun_ajaran")
		.notEmpty()
		.withMessage("Tahun ajaran wajib diisi.")
		.matches(/^\d{4}\/\d{4}$/)
		.withMessage("Format tahun ajaran harus YYYY/YYYY (contoh: 2024/2025)."),

	// 2. Semester (Wajib, misal: Ganjil/Genap atau 1/2)
	body("semester")
		.notEmpty()
		.withMessage("Semester wajib diisi.")
		.isString()
		.withMessage("Semester harus berupa teks."),

	// 3. Status (Draft/Published)
	body("status")
		.optional()
		.isIn(["Draft", "Published"])
		.withMessage("Status harus berupa 'Draft' atau 'Published'."),

	// 4. Nilai JSON (Wajib, Harus berupa Objek)
	body("nilai_json")
		.notEmpty()
		.withMessage("Data nilai (JSON) wajib diisi.")
		.isObject()
		.withMessage("Data nilai harus berupa objek JSON { 'Mapel': nilai }."),

	// 5. Student User ID (Siswa yang punya nilai)
	body("student_user_id")
		.notEmpty()
		.withMessage("ID Siswa wajib diisi.")
		// .isUUID(4) // DIHAPUS: Agar bisa menerima teks biasa (seperti "chairul")
		// .withMessage("ID Siswa harus berupa UUID v4 yang valid.") // DIHAPUS
		.isString() // TAMBAHAN: Cukup pastikan dia adalah teks
		.withMessage("ID Siswa harus berupa string (Username/ID)."),

	// 6. Jenjang ID (Wajib)
	body("jenjang_id")
		.notEmpty()
		.withMessage("Jenjang ID wajib diisi.")
		.isUUID(4)
		.withMessage("Jenjang ID harus berupa UUID v4 yang valid."),

	// 7. Catatan (Opsional)
	body("catatan").optional({ nullable: true }).isString().withMessage("Catatan harus berupa teks."),

	checkValidationResult,
];

// ====================================================
// VALIDASI EDIT DATA NILAI (PUT/PATCH)
// ====================================================
export const validasiEditSubjectGrade = [
	param("grade_id").isUUID(4).withMessage("ID Nilai harus berupa UUID v4 yang valid."),

	body("tahun_ajaran")
		.optional({ checkFalsy: true })
		.matches(/^\d{4}\/\d{4}$/)
		.withMessage("Format tahun ajaran harus YYYY/YYYY."),

	body("semester").optional({ checkFalsy: true }).isString(),

	body("status")
		.optional()
		.isIn(["Draft", "Published"])
		.withMessage("Status harus 'Draft' atau 'Published'."),

	body("nilai_json").optional().isObject().withMessage("Data nilai harus berupa objek JSON."),

	// .isUUID(4) // DIHAPUS: Agar fleksibel saat edit
	body("student_user_id").optional({ checkFalsy: true }).isString(),

	body("jenjang_id").optional({ checkFalsy: true }).isUUID(4),

	body("catatan").optional({ nullable: true }).isString(),

	checkValidationResult,
];

// ====================================================
// VALIDASI HAPUS DATA NILAI
// ====================================================
export const validasiHapusSubjectGrade = [
	param("grade_id").isUUID(4).withMessage("ID Nilai tidak valid."),
	checkValidationResult,
];

export const validasiCekNilaiPublik = [
	body("nisn").notEmpty().withMessage("NISN wajib diisi"),
	body("nama").notEmpty().withMessage("Nama wajib diisi"), // pastikan ada
	body("tanggal_lahir").notEmpty().withMessage("Tanggal lahir wajib diisi"),
	// hapus validasi kelas jika tidak dipakai, atau biarkan optional
];
