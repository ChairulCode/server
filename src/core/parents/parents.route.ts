import { Router } from "express";
import { orangTuaController } from "./parents.controller";
import {
	validateOrangTuaId,
	validateSiswaIdParam,
	validateCreateOrangTua,
	validateUpdateOrangTua,
} from "./parents.validator";

const router = Router();

/**
 * @route  GET /api/siswa/:siswaId
 * @desc   Ambil semua data orang tua berdasarkan siswa
 * @access Public
 */
router.get(
	"/siswa/:siswaId",
	validateSiswaIdParam,
	orangTuaController.getBySiswaId.bind(orangTuaController)
);

/**
 * @route  POST /api/siswa/:siswaId
 * @desc   Tambah data orang tua untuk siswa tertentu
 * @body   { namaAyah, namaIbu, pekerjaanAyah?, pekerjaanIbu?, teleponAyah?, teleponIbu?, alamatOrangTua? }
 * @access Public
 */
router.post(
	"/siswa/:siswaId",
	validateCreateOrangTua,
	orangTuaController.create.bind(orangTuaController)
);

/**
 * @route  GET /api/:id
 * @desc   Ambil detail data orang tua by ID
 * @access Public
 */
router.get("/:id", validateOrangTuaId, orangTuaController.getById.bind(orangTuaController));

/**
 * @route  PUT /api/:id
 * @desc   Update data orang tua
 * @access Public
 */
router.put("/:id", validateUpdateOrangTua, orangTuaController.update.bind(orangTuaController));

/**
 * @route  DELETE /api/:id
 * @desc   Hapus data orang tua
 * @access Public
 */
router.delete("/:id", validateOrangTuaId, orangTuaController.delete.bind(orangTuaController));

export default router;
