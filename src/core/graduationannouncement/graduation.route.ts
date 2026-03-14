import express from "express";
import {
	buatKelulusan,
	ambilSemuaKelulusan,
	cekStatusLulus,
	editKelulusan,
	hapusKelulusan,
	cekKelulusanSiswaController,
} from "./graduation.controller";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import {
	validasiBuatKelulusan,
	validasiEditKelulusan,
	validasiHapusKelulusan,
	validasiCekSiswa,
} from "./graduation.validator";

const router = express.Router();

// --- ENDPOINT PUBLIK ---

router.get(
	"/search/:nomor_siswa",
	cekStatusLulus
	/**
	 * #swagger
	 * #swagger.tags = ['Kelulusan']
	 * #swagger.path = '/api/v1/graduation/search/{nomor_siswa}'
	 * #swagger.description = 'Siswa mencari status kelulusan berdasarkan Nomor Ujian.'
	 * #swagger.summary = 'Cek Status Lulus (Publik).'
	 */
);

// --- ENDPOINT ADMIN (PROTECTED) ---

router.get(
	"/",
	ambilSemuaKelulusan
	/**
	 * #swagger
	 * #swagger.tags = ['Kelulusan']
	 * #swagger.path = '/api/v1/graduation/'
	 * #swagger.description = 'Melihat daftar semua data kelulusan (Admin).'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);
router.get("/search/:nomor_siswa", cekStatusLulus);

// Cek kelulusan siswa: nomor_siswa + tanggal_lahir (BARU)
router.post("/cek-siswa", validasiCekSiswa, cekKelulusanSiswaController);

router.post(
	"/",
	authenticateJWT,
	validasiBuatKelulusan,
	buatKelulusan
	/**
	 * #swagger
	 * #swagger.tags = ['Kelulusan']
	 * #swagger.path = '/api/v1/graduation'
	 * #swagger.description = 'Menambahkan data kelulusan baru.'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

router.put(
	"/:kelulusan_id",
	authenticateJWT,
	validasiEditKelulusan,
	editKelulusan
	/**
	 * #swagger
	 * #swagger.tags = ['Kelulusan']
	 * #swagger.path = '/api/v1/graduation/{kelulusan_id}'
	 * #swagger.description = 'Mengubah data kelulusan berdasarkan ID.'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

router.delete(
	"/:kelulusan_id",
	authenticateJWT,
	validasiHapusKelulusan,
	hapusKelulusan
	/**
	 * #swagger
	 * #swagger.tags = ['Kelulusan']
	 * #swagger.path = '/api/v1/graduation/{kelulusan_id}'
	 * #swagger.description = 'Menghapus data kelulusan.'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
