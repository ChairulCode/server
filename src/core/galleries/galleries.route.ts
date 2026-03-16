import express from "express";
import galleriesController from "./galleries.controller";
import { uploadDynamic } from "../../shared/middlewares/uploadMiddleware";
import { compressImage } from "../../shared/middlewares/imageCompression";
import authenticateJWT from "../../shared/middlewares/jwtVerification";

const router = express.Router();

// add photo — upload lalu auto compress ke WebP 1280px
router.post(
	"/add/:folder_name",
	authenticateJWT,
	uploadDynamic.single("image"),
	compressImage, // ← kompresi setelah multer simpan file
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
