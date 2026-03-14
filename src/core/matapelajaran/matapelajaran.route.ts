// src/core/matapelajaran/matapelajaran.routes.ts

import { Router } from "express";
import { mataPelajaranController } from "./matapelajaran.controller";
import {
	validateGetByKelas,
	validateGetByTingkatan,
	validateCreateMapel,
	validateUpdateMapel,
	validateMapelId,
} from "./matapelajaran.validator";

const router = Router();

// GET /api/mata-pelajaran?kelas=10 IPA 1
router.get(
	"/",
	validateGetByKelas,
	mataPelajaranController.getByKelas.bind(mataPelajaranController)
);

// GET /api/mata-pelajaran/all
router.get("/all", mataPelajaranController.getAll.bind(mataPelajaranController));

// GET /api/mata-pelajaran/tingkatan/:tingkatan
router.get(
	"/tingkatan/:tingkatan",
	validateGetByTingkatan,
	mataPelajaranController.getByTingkatan.bind(mataPelajaranController)
);

// POST /api/mata-pelajaran
router.post("/", validateCreateMapel, mataPelajaranController.create.bind(mataPelajaranController));

// PUT /api/mata-pelajaran/:id
router.put(
	"/:id",
	validateUpdateMapel,
	mataPelajaranController.update.bind(mataPelajaranController)
);

// DELETE /api/mata-pelajaran/:id  (soft delete)
router.delete(
	"/:id",
	validateMapelId,
	mataPelajaranController.delete.bind(mataPelajaranController)
);

export default router;
