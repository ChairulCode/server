import express, { Request, Response, NextFunction } from "express";
import multer from "multer"; // Tambahkan import multer di sini
import galleriesController from "./galleries.controller";
import { uploadDynamic } from "../../shared/middlewares/uploadMiddleware";
import { compressImage } from "../../shared/middlewares/imageCompression";
import authenticateJWT from "../../shared/middlewares/jwtVerification";

const router = express.Router();

/**
 * Handler Manual untuk Upload
 * Kita membungkus middleware uploadDynamic agar bisa menangkap error Multer
 * sebelum masuk ke middleware kompresi (Sharp).
 */
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
	uploadDynamic.single("image")(req, res, (err: any) => {
		if (err instanceof multer.MulterError) {
			// Menangkap error spesifik dari Multer
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({
					message: "File terlalu besar! Maksimal 10MB agar server tidak terbebani.",
					error: err.code,
				});
			}
			return res.status(400).json({
				message: `Kesalahan upload: ${err.message}`,
				error: err.code,
			});
		} else if (err) {
			// Menangkap error dari fileFilter (format file salah, dll)
			return res.status(400).json({
				message: err.message,
			});
		}

		// Jika tidak ada error, lanjut ke middleware compressImage
		next();
	});
};

// --- ROUTES ---

// add photo — upload, tangkap error, lalu auto compress ke WebP 1280px
router.post(
	"/add/:folder_name",
	authenticateJWT,
	handleUpload, // ← Panggil handler manual yang sudah kita buat di atas
	compressImage, // ← Hanya berjalan jika file lolos seleksi Multer
	galleriesController.addPhoto
);

// get all photos
router.get("/all", galleriesController.getPhotos);

// get photo by id
router.get("/:pic_id", galleriesController.getPhotoById);

// edit photo by id
router.put("/edit/:pic_id", authenticateJWT, galleriesController.editPhoto);

// delete photo
router.delete("/delete/:pic_id", authenticateJWT, galleriesController.deletePhoto);

export default router;
