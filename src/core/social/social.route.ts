import express from "express";
import {
	buatSocialMedia,
	ambilSemuaSocialMedia,
	ambilDetailSocialMedia,
	editSocialMedia,
	hapusSocialMedia,
} from "./social.controller";

import {
	validasiBuatSocialMedia,
	validasiEditSocialMedia,
	// validasiAmbilDetailSocialMedia,
	validasiHapusSocialMedia,
} from "./social.validator";

import authenticateJWT from "../../shared/middlewares/jwtVerification";

const router = express.Router();

/* ====================================================
   GET ALL
==================================================== */
router.get(
	"/",
	ambilSemuaSocialMedia
	/**
	 * #swagger
	 * #swagger.tags = ['Social Media']
	 * #swagger.path = '/api/v1/social-media'
	 * #swagger.summary = 'Melihat daftar Social Media'
	 * #swagger.method = 'get'
	 */
);

/* ====================================================
   GET DETAIL
==================================================== */
router.get(
	"/:social_media_id",
	// validasiAmbilDetailSocialMedia,
	ambilDetailSocialMedia
	/**
	 * #swagger
	 * #swagger.tags = ['Social Media']
	 * #swagger.path = '/api/v1/social-media/{social_media_id}'
	 * #swagger.summary = 'Melihat detail Social Media'
	 */
);

/* ====================================================
   CREATE
==================================================== */
router.post(
	"/",
	authenticateJWT,
	validasiBuatSocialMedia,
	buatSocialMedia
	/**
	 * #swagger
	 * #swagger.tags = ['Social Media']
	 * #swagger.path = '/api/v1/social-media'
	 * #swagger.summary = 'Menambahkan Social Media'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

/* ====================================================
   UPDATE (PUT)
==================================================== */
router.put(
	"/:social_media_id",
	authenticateJWT,
	validasiEditSocialMedia,
	editSocialMedia
	/**
	 * #swagger
	 * #swagger.tags = ['Social Media']
	 * #swagger.path = '/api/v1/social-media/{social_media_id}'
	 * #swagger.summary = 'Mengubah Social Media (lengkap)'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

/* ====================================================
   UPDATE (PATCH)
==================================================== */
router.patch(
	"/:social_media_id",
	authenticateJWT,
	validasiEditSocialMedia,
	editSocialMedia
	/**
	 * #swagger
	 * #swagger.tags = ['Social Media']
	 * #swagger.path = '/api/v1/social-media/{social_media_id}'
	 * #swagger.summary = 'Mengubah Social Media (sebagian)'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

/* ====================================================
   DELETE
==================================================== */
router.delete(
	"/:social_media_id",
	authenticateJWT,
	validasiHapusSocialMedia,
	hapusSocialMedia
	/**
	 * #swagger
	 * #swagger.tags = ['Social Media']
	 * #swagger.path = '/api/v1/social-media/{social_media_id}'
	 * #swagger.summary = 'Menghapus Social Media'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
