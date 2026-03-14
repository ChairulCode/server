import express from "express";
import {
	buatCarousel,
	ambilDetailCarousel,
	ambilSemuaCarousel,
	editCarouselLengkap,
	editCarouselSebagian,
	hapusCarousel,
} from "./carousels.controller";
import {
	validasiAmbilDetailCarousel,
	validasiBuatCarousel,
	validasiEditCarousel,
	validasiHapusCarousel,
} from "./carousels.validator";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
// import csrfProtection from "../middlewares/csrfProtection";

const router = express.Router();

router.get(
	"/",
	ambilSemuaCarousel
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/'
	 * #swagger.description = 'Melihat daftar semua Carousel.'
	 * #swagger.summary = 'Melihat daftar semua Carousel.'
	 * #swagger.method = 'get'
	 */
);

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

router.post(
	"/",
	// csrfProtection,
	authenticateJWT,
	validasiBuatCarousel,
	buatCarousel
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels'
	 * #swagger.description = 'Menambahkan Carousel baru.'
	 * #swagger.summary = 'Menambahkan Carousel baru.'
	 * #swagger.method = 'post'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Carousel' } }
	 */
);

router.put(
	"/:carousel_id",
	// csrfProtection,
	authenticateJWT,
	validasiEditCarousel,
	editCarouselLengkap
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/{carousel_id}'
	 * #swagger.description = 'Mengubah data Carousel berdasarkan Carousel ID.'
	 * #swagger.summary = 'Mengubah data Carousel berdasarkan Carousel ID.'
	 * #swagger.method = 'put'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CarouselReplace' } }
	 * #swagger.parameters['carousel_id'] = { in: 'path', description: 'ID Carousel.', required: true, type: 'string' }
	 */
);

router.patch(
	"/:carousel_id",
	// csrfProtection,
	authenticateJWT,
	validasiEditCarousel,
	editCarouselSebagian
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/{carousel_id}'
	 * #swagger.description = 'Mengubah data Carousel berdasarkan Carousel ID.'
	 * #swagger.summary = 'Mengubah data Carousel berdasarkan Carousel ID.'
	 * #swagger.method = 'patch'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CarouselUpdate' } }
	 * #swagger.parameters['carousel_id'] = { in: 'path', description: 'ID Carousel.', required: true, type: 'string' }
	 */
);

router.delete(
	"/:carousel_id",
	authenticateJWT,
	validasiHapusCarousel,
	hapusCarousel
	/**
	 * #swagger
	 * #swagger.tags = ['Carousel']
	 * #swagger.path = '/api/v1/carousels/{carousel_id}'
	 * #swagger.description = 'Menghapus Carousel berdasarkan Carousel ID.'
	 * #swagger.summary = 'Menghapus Carousel berdasarkan Carousel ID.'
	 * #swagger.method = 'delete'
	 * #swagger.parameters['carousel_id'] = { in: 'path', description: 'ID Carousel.', required: true, type: 'string' }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
