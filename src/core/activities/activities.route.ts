import express from "express";
import {
	buatKegiatan,
	ambilDetailKegiatan,
	ambilSemuaKegiatan,
	editKegiatanLengkap,
	editKegiatanSebagian,
	hapusKegiatan,
} from "./activities.controller";
import {
	validasiAmbilDetailKegiatan,
	validasiBuatKegiatan,
	validasiEditKegiatan,
	validasiHapusKegiatan,
} from "./activities.validator";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import { filterCarouselByRole } from "../../shared/middlewares/carousel/permission.middleware";

const router = express.Router();

router.get(
	"/",
	(req, res, next) => {
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer ")) {
			return authenticateJWT(req, res, (err) => {
				if (err) return next();
				filterCarouselByRole(req, res, next);
			});
		}
		next();
	},
	ambilSemuaKegiatan
	/**
	 * #swagger
	 * #swagger.tags = ['Kegiatan']
	 * #swagger.path = '/api/v1/kegiatan/'
	 * #swagger.description = 'Melihat daftar semua Kegiatan.'
	 * #swagger.summary = 'Melihat daftar semua Kegiatan.'
	 * #swagger.method = 'get'
	 */
);

router.get(
	"/:kegiatan_id",
	validasiAmbilDetailKegiatan,
	ambilDetailKegiatan
	/**
	 * #swagger
	 * #swagger.tags = ['Kegiatan']
	 * #swagger.path = '/api/v1/kegiatan/{kegiatan_id}'
	 * #swagger.description = 'Melihat detail Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.summary = 'Melihat detail Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.method = 'get'
	 * #swagger.parameters['kegiatan_id'] = {in: 'path', description: 'ID Kegiatan.', required: true, type: 'string'}
	 */
);

router.post(
	"/",
	// csrfProtection,
	authenticateJWT,
	validasiBuatKegiatan,
	buatKegiatan
	/**
	 * #swagger
	 * #swagger.tags = ['Kegiatan']
	 * #swagger.path = '/api/v1/kegiatan'
	 * #swagger.description = 'Menambahkan Kegiatan baru.'
	 * #swagger.summary = 'Menambahkan Kegiatan baru.'
	 * #swagger.method = 'post'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Kegiatan' } }
	 */
);

router.put(
	"/:kegiatan_id",
	// csrfProtection,
	authenticateJWT,
	validasiEditKegiatan,
	editKegiatanLengkap
	/**
	 * #swagger
	 * #swagger.tags = ['Kegiatan']
	 * #swagger.path = '/api/v1/kegiatan/{kegiatan_id}'
	 * #swagger.description = 'Mengubah data Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.summary = 'Mengubah data Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.method = 'put'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/KegiatanReplace' } }
	 * #swagger.parameters['kegiatan_id'] = { in: 'path', description: 'ID Kegiatan.', required: true, type: 'string' }
	 */
);

router.patch(
	"/:kegiatan_id",
	// csrfProtection,
	authenticateJWT,
	validasiEditKegiatan,
	editKegiatanSebagian
	/**
	 * #swagger
	 * #swagger.tags = ['Kegiatan']
	 * #swagger.path = '/api/v1/kegiatan/{kegiatan_id}'
	 * #swagger.description = 'Mengubah data Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.summary = 'Mengubah data Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.method = 'patch'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/KegiatanUpdate' } }
	 * #swagger.parameters['kegiatan_id'] = { in: 'path', description: 'ID Kegiatan.', required: true, type: 'string' }
	 */
);

router.delete(
	"/:kegiatan_id",
	authenticateJWT,
	validasiHapusKegiatan,
	hapusKegiatan
	/**
	 * #swagger
	 * #swagger.tags = ['Kegiatan']
	 * #swagger.path = '/api/v1/kegiatan/{kegiatan_id}'
	 * #swagger.description = 'Menghapus Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.summary = 'Menghapus Kegiatan berdasarkan Kegiatan ID.'
	 * #swagger.method = 'delete'
	 * #swagger.parameters['kegiatan_id'] = { in: 'path', description: 'ID Kegiatan.', required: true, type: 'string' }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
