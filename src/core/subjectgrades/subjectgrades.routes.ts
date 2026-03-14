import express from "express";
import {
	buatSubjectGrade,
	ambilSemuaSubjectGrades,
	ambilNilaiSiswa,
	editSubjectGrade,
	hapusSubjectGrade,
	handleCekNilaiSiswaPublik,
} from "./subjectgrades.controller";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import {
	validasiBuatSubjectGrade,
	validasiCekNilaiPublik,
	validasiEditSubjectGrade,
	validasiHapusSubjectGrade,
} from "./subjectgrades.validator";

const router = express.Router();

// ====================================================
// ENDPOINT KHUSUS SISWA (PROTECTED)
// ====================================================

router.get(
	"/my-grades",
	authenticateJWT,
	ambilNilaiSiswa
	/**
	 * #swagger.tags = ['Subject Grades']
	 * #swagger.path = '/api/v1/subject-grades/my-grades'
	 * #swagger.description = 'Siswa melihat daftar nilai/rapor miliknya sendiri.'
	 * #swagger.summary = 'Ambil Nilai Pribadi (Siswa).'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// ====================================================
// ENDPOINT ADMIN/GURU (PROTECTED)
// ====================================================

router.get(
	"/",
	// authenticateJWT,
	ambilSemuaSubjectGrades
	/**
	 * #swagger.tags = ['Subject Grades']
	 * #swagger.path = '/api/v1/subject-grades/'
	 * #swagger.description = 'Melihat semua daftar nilai dengan filter jenjang & search (Admin).'
	 * #swagger.summary = 'Ambil Semua Nilai (Admin).'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);
router.post("/cek-publik", validasiCekNilaiPublik, handleCekNilaiSiswaPublik);

router.post(
	"/",
	authenticateJWT,
	validasiBuatSubjectGrade,
	buatSubjectGrade
	/**
	 * #swagger.tags = ['Subject Grades']
	 * #swagger.path = '/api/v1/subject-grades'
	 * #swagger.description = 'Menambahkan data nilai subjek baru untuk siswa.'
	 * #swagger.summary = 'Buat Data Nilai Baru.'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

router.put(
	"/:grade_id",
	authenticateJWT,
	validasiEditSubjectGrade,
	editSubjectGrade
	/**
	 * #swagger.tags = ['Subject Grades']
	 * #swagger.path = '/api/v1/subject-grades/{grade_id}'
	 * #swagger.description = 'Mengubah data nilai berdasarkan ID.'
	 * #swagger.summary = 'Edit Data Nilai.'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

router.delete(
	"/:grade_id",
	authenticateJWT,
	validasiHapusSubjectGrade,
	hapusSubjectGrade
	/**
	 * #swagger.tags = ['Subject Grades']
	 * #swagger.path = '/api/v1/subject-grades/{grade_id}'
	 * #swagger.description = 'Menghapus data nilai berdasarkan ID.'
	 * #swagger.summary = 'Hapus Data Nilai.'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
