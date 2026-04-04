import express from "express";
import {
	buatCarousel,
	ambilDetailCarousel,
	ambilSemuaCarousel,
	editCarouselLengkap,
	editCarouselSebagian,
	ambilCarouselPublik,
	hapusCarousel,
} from "./carousels.controller";
import {
	validasiAmbilDetailCarousel,
	validasiBuatCarousel,
	validasiEditCarousel,
	validasiHapusCarousel,
} from "./carousels.validator";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import {
	checkCarouselPermission,
	filterCarouselByRole,
} from "../../shared/middlewares/carousel/permission.middleware";

const router = express.Router();

router.get("/publik", ambilCarouselPublik);

router.get("/:carousel_id", validasiAmbilDetailCarousel, ambilDetailCarousel);

/**
 * GET /api/v1/carousels
 * Public route - tapi jika authenticated, filter berdasarkan role
 */
router.get(
	"/",
	// Middleware opsional untuk filter berdasarkan role (jika ada JWT)
	(req, res, next) => {
		// Check jika ada Authorization header
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer ")) {
			// Jika ada token, jalankan authenticateJWT dulu
			return authenticateJWT(req, res, (err) => {
				if (err) return next(); // Skip auth jika token invalid (tetap public)
				// Lalu filter by role
				filterCarouselByRole(req, res, next);
			});
		}
		// Jika tidak ada token, langsung next (public access)
		next();
	},
	ambilSemuaCarousel
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/'
	 * #swagger.description = 'Melihat daftar semua Carousel. Jika authenticated, filtered by role.'
	 * #swagger.summary = 'Melihat daftar semua Carousel.'
	 * #swagger.method = 'get'
	 */
);

/**
 * GET /api/v1/carousels/:carousel_id
 * Public route - detail carousel
 */
router.get(
	"/:carousel_id",
	validasiAmbilDetailCarousel,
	ambilDetailCarousel
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/{carousel_id}'
	 * #swagger.description = 'Melihat detail Carousel berdasarkan Carousel ID.'
	 * #swagger.summary = 'Melihat detail Carousel berdasarkan Carousel ID.'
	 * #swagger.method = 'get'
	 * #swagger.parameters['carousel_id'] = {in: 'path', description: 'ID Carousel.', required: true, type: 'string'}
	 */
);

/**
 * POST /api/v1/carousels
 * Protected - Hanya admin yang sesuai jenjangnya atau superadmin
 */
router.post(
	"/",
	authenticateJWT,
	checkCarouselPermission, // Check permission sebelum create
	validasiBuatCarousel,
	buatCarousel
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels'
	 * #swagger.description = 'Menambahkan Carousel baru. Hanya admin sesuai jenjang atau superadmin.'
	 * #swagger.summary = 'Menambahkan Carousel baru.'
	 * #swagger.method = 'post'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Carousel' } }
	 */
);

/**
 * PUT /api/v1/carousels/:carousel_id
 * Protected - Hanya admin yang sesuai jenjangnya atau superadmin
 */
router.put(
	"/:carousel_id",
	authenticateJWT,
	checkCarouselPermission, // Check permission sebelum update
	validasiEditCarousel,
	editCarouselLengkap
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/{carousel_id}'
	 * #swagger.description = 'Mengubah data Carousel berdasarkan Carousel ID. Hanya admin sesuai jenjang atau superadmin.'
	 * #swagger.summary = 'Mengubah data Carousel berdasarkan Carousel ID.'
	 * #swagger.method = 'put'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CarouselReplace' } }
	 * #swagger.parameters['carousel_id'] = { in: 'path', description: 'ID Carousel.', required: true, type: 'string' }
	 */
);

/**
 * PATCH /api/v1/carousels/:carousel_id
 * Protected - Hanya admin yang sesuai jenjangnya atau superadmin
 */
router.patch(
	"/:carousel_id",
	authenticateJWT,
	checkCarouselPermission, // Check permission sebelum update
	validasiEditCarousel,
	editCarouselSebagian
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/{carousel_id}'
	 * #swagger.description = 'Mengubah data Carousel berdasarkan Carousel ID. Hanya admin sesuai jenjang atau superadmin.'
	 * #swagger.summary = 'Mengubah data Carousel berdasarkan Carousel ID.'
	 * #swagger.method = 'patch'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CarouselUpdate' } }
	 * #swagger.parameters['carousel_id'] = { in: 'path', description: 'ID Carousel.', required: true, type: 'string' }
	 */
);

/**
 * DELETE /api/v1/carousels/:carousel_id
 * Protected - Hanya admin yang sesuai jenjangnya atau superadmin
 */
router.delete(
	"/:carousel_id",
	authenticateJWT,
	checkCarouselPermission, // Check permission sebelum delete
	validasiHapusCarousel,
	hapusCarousel
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/{carousel_id}'
	 * #swagger.description = 'Menghapus Carousel berdasarkan Carousel ID. Hanya admin sesuai jenjang atau superadmin.'
	 * #swagger.summary = 'Menghapus Carousel berdasarkan Carousel ID.'
	 * #swagger.method = 'delete'
	 * #swagger.parameters['carousel_id'] = { in: 'path', description: 'ID Carousel.', required: true, type: 'string' }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
