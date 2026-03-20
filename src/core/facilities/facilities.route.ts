import express from "express";
import {
	buatFasilitas,
	ambilSemuaFasilitas,
	ambilDetailFasilitas,
	editFasilitasLengkap,
	editFasilitasSebagian,
	hapusFasilitas,
	uploadGambarFasilitas,
	hapusGambarFasilitas,
} from "./facilities.controller";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import {
	validasiBuatFasilitas,
	validasiPutFasilitas,
	validasiPatchFasilitas,
	validasiHapusFasilitas,
	validasiGetFasilitas,
	validasiUploadGambar,
	validasiHapusGambar,
} from "./facilities.validator";
import { uploadDynamic } from "../../shared/middlewares/uploadMiddleware";
import { compressImage } from "../../shared/middlewares/imageCompression";

const router = express.Router();

// ─── FASILITAS ────────────────────────────────────────────────────────────────

// GET /api/v1/fasilitas
router.get("/", ambilSemuaFasilitas);

// GET /api/v1/fasilitas/:fasilitas_id
router.get("/:fasilitas_id", validasiGetFasilitas, ambilDetailFasilitas);

// POST /api/v1/fasilitas
router.post("/", authenticateJWT, validasiBuatFasilitas, buatFasilitas);

// PUT /api/v1/fasilitas/:fasilitas_id
router.put("/:fasilitas_id", authenticateJWT, validasiPutFasilitas, editFasilitasLengkap);

// PATCH /api/v1/fasilitas/:fasilitas_id
router.patch("/:fasilitas_id", authenticateJWT, validasiPatchFasilitas, editFasilitasSebagian);

// DELETE /api/v1/fasilitas/:fasilitas_id
router.delete("/:fasilitas_id", authenticateJWT, validasiHapusFasilitas, hapusFasilitas);

// ─── GAMBAR ───────────────────────────────────────────────────────────────────

// POST /api/v1/fasilitas/:fasilitas_id/gambar
// Alur: set folder_name → uploadDynamic simpan ke /public/facilities/ → compressImage → controller
router.post(
	"/:fasilitas_id/gambar",
	authenticateJWT,
	// Middleware kecil: set req.params.folder_name agar uploadDynamic tahu folder tujuan
	(req: { params: { folder_name: string } }, _res: any, next: () => void) => {
		req.params.folder_name = "facilities";
		next();
	},
	uploadDynamic.single("image"), // field name harus "image" dari frontend
	compressImage, // compress ke WebP 1280px, update req.file.filename
	validasiUploadGambar,
	uploadGambarFasilitas
);

// DELETE /api/v1/fasilitas/:fasilitas_id/gambar/:gambar_id
router.delete(
	"/:fasilitas_id/gambar/:gambar_id",
	authenticateJWT,
	validasiHapusGambar,
	hapusGambarFasilitas
);

export default router;
