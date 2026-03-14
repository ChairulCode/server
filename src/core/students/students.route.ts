import { Router } from "express";
import { siswaController } from "./students.controller";
import {
	validateCreateSiswa,
	validateUpdateSiswa,
	validateSiswaId,
	validateSiswaQuery,
} from "./students.validator";

const router = Router();

/**
 * @route  GET /api/students/meta/kelas
 * @desc   Ambil daftar kelas yang tersedia
 * @access Public
 */
router.get("/meta/kelas", siswaController.getKelasList.bind(siswaController));

/**
 * @route  GET /api/students
 * @desc   Ambil semua students dengan filter & pagination
 * @query  nama, nisn, kelas, jenisKelamin, status, page, limit, sortBy, sortOrder
 * @access Public
 */
router.get("/", validateSiswaQuery, siswaController.getAll.bind(siswaController));

/**
 * @route  GET /api/students/:id
 * @desc   Ambil detail students beserta orang tua dan nilai
 * @access Public
 */
router.get("/:id", validateSiswaId, siswaController.getById.bind(siswaController));

/**
 * @route  POST /api/students
 * @desc   Tambah students baru
 * @body   { nama, nisn, alamat, tanggalLahir, jenisKelamin, kelas, telepon?, email?, status? }
 * @access Public
 */
router.post("/", validateCreateSiswa, siswaController.create.bind(siswaController));

/**
 * @route  PUT /api/students/:id
 * @desc   Update data students
 * @body   (semua field opsional)
 * @access Public
 */
router.put("/:id", validateUpdateSiswa, siswaController.update.bind(siswaController));

/**
 * @route  DELETE /api/students/:id
 * @desc   Hapus students (cascade: orang tua & nilai ikut terhapus)
 * @access Public
 */
router.delete("/:id", validateSiswaId, siswaController.delete.bind(siswaController));

export default router;
