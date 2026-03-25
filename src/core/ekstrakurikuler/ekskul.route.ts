import express from "express";
import {
	buatEkskul,
	ambilSemuaEkskul,
	ambilDetailEkskul,
	editEkskulLengkap,
	editEkskulSebagian,
	hapusEkskul,
	uploadGambarEkskul,
	hapusGambarEkskul,
} from "./ekskul.controller";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import {
	validasiBuatEkskul,
	validasiPutEkskul,
	validasiPatchEkskul,
	validasiHapusEkskul,
	validasiGetEkskul,
	validasiUploadGambar,
	validasiHapusGambar,
} from "./ekskul.validator";
import { uploadDynamic } from "../../shared/middlewares/uploadMiddleware";
import { compressImage } from "../../shared/middlewares/imageCompression";

const router = express.Router();

router.get("/", ambilSemuaEkskul);
router.get("/:ekskul_id", validasiGetEkskul, ambilDetailEkskul);
router.post("/", authenticateJWT, validasiBuatEkskul, buatEkskul);
router.put("/:ekskul_id", authenticateJWT, validasiPutEkskul, editEkskulLengkap);
router.patch("/:ekskul_id", authenticateJWT, validasiPatchEkskul, editEkskulSebagian);
router.delete("/:ekskul_id", authenticateJWT, validasiHapusEkskul, hapusEkskul);

router.post(
	"/:ekskul_id/gambar",
	authenticateJWT,
	(req: any, _res: any, next: () => void) => {
		req.params.folder_name = "ekstrakurikuler";
		next();
	},
	uploadDynamic.single("image"),
	compressImage,
	validasiUploadGambar,
	uploadGambarEkskul
);

router.delete(
	"/:ekskul_id/gambar/:gambar_id",
	authenticateJWT,
	validasiHapusGambar,
	hapusGambarEkskul
);

export default router;
