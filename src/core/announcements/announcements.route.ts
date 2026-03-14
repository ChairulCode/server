import express from "express";
import {
	buatPengumuman,
	ambilDetailPengumuman,
	ambilSemuaPengumuman,
	editPengumumanLengkap,
	editPengumumanSebagian,
	hapusPengumuman,
} from "./announcements.controller";
import {
	validasiAmbilDetailPengumuman,
	validasiBuatPengumuman,
	validasiEditPengumuman,
	validasiHapusPengumuman,
} from "./announcements.validator";
import authenticateJWT from "../../shared/middlewares/jwtVerification";

const router = express.Router();

router.get(
	"/",
	ambilSemuaPengumuman
	/**
	 * #swagger
	 * #swagger.tags = ['Pengumuman']
	 * #swagger.path = '/api/v1/pengumuman/'
	 * #swagger.description = 'Melihat daftar semua Pengumuman.'
	 * #swagger.summary = 'Melihat daftar semua Pengumuman.'
	 * #swagger.method = 'get'
	 */
);

router.get(
	"/:pengumuman_id",
	validasiAmbilDetailPengumuman,
	ambilDetailPengumuman
	/**
	 * #swagger
	 * #swagger.tags = ['Pengumuman']
	 * #swagger.path = '/api/v1/pengumuman/{:pengumuman_id}'
	 * #swagger.description = 'Melihat detail Pengumuman berdasarkan ID.'
	 * #swagger.summary = 'Melihat detail Pengumuman berdasarkan ID.'
	 * #swagger.method = 'get'
	 * #swagger.parameters['pengumuman_id'] = { in: 'path', description: 'ID Pengumuman.', required: true, type: 'string' }
	 */
);

router.post(
	"/",
	authenticateJWT,
	validasiBuatPengumuman,
	buatPengumuman
	/**
	 * #swagger
	 * #swagger.tags = ['Pengumuman']
	 * #swagger.path = '/api/v1/pengumuman'
	 * #swagger.description = 'Menambahkan Pengumuman baru.'
	 * #swagger.summary = 'Menambahkan Pengumuman baru.'
	 * #swagger.method = 'post'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Pengumuman' } }
	 */
);

router.put(
	"/:pengumuman_id",
	authenticateJWT,
	validasiEditPengumuman,
	editPengumumanLengkap
	/**
	 * #swagger
	 * #swagger.tags = ['Pengumuman']
	 * #swagger.path = '/api/v1/pengumuman/{:pengumuman_id}'
	 * #swagger.description = 'Mengubah data Pengumuman berdasarkan ID.'
	 * #swagger.summary = 'Mengubah data Pengumuman berdasarkan ID.'
	 * #swagger.method = 'put'
	 * #swagger.parameters[':pengumuman_id'] = {in: 'path', description: 'ID Pengumuman.', required: true, type: 'string'}
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/PengumumanReplace' } }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

router.patch(
	"/:id",
	authenticateJWT,
	validasiEditPengumuman,
	editPengumumanSebagian
	/**
	 * #swagger
	 * #swagger.tags = ['Pengumuman']
	 * #swagger.path = '/api/v1/pengumuman/{pengumuman_id}'
	 * #swagger.description = 'Mengubah data Pengumuman berdasarkan ID.'
	 * #swagger.summary = 'Mengubah data Pengumuman berdasarkan ID.'
	 * #swagger.method = 'patch'
	 * #swagger.parameters['pengumuman_id'] = {in: 'path', description: 'ID Pengumuman.', required: true, type: 'string'}
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/PengumumanUpdate' } }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

router.delete(
	"/:pengumuman_id",
	authenticateJWT,
	validasiHapusPengumuman,
	hapusPengumuman
	/**
	 * #swagger
	 * #swagger.tags = ['Pengumuman']
	 * #swagger.path = '/api/v1/pengumuman/{:pengumuman_id}'
	 * #swagger.description = 'Menghapus Pengumuman berdasarkan ID.'
	 * #swagger.summary = 'Menghapus Pengumuman berdasarkan ID.'
	 * #swagger.method = 'delete'
	 * #swagger.parameters[':pengumuman_id'] = {in: 'path', description: 'ID Pengumuman.', required: true, type: 'string'}
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
