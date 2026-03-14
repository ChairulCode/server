import express from "express";
import {
	buatPrestasi,
	editPrestasiLengkap,
	editPrestasiSebagian,
	hapusPrestasi,
	ambilDetailPrestasi,
	ambilSemuaPrestasi,
} from "./achievements.controller";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import {
	validasiBuatPrestasi,
	validasiPutPrestasi,
	validasiPatchPrestasi,
	validasiHapusPrestasi,
	validasiGetPrestasi,
} from "./achievements.validator";
// import csrfProtection from "../middlewares/csrfProtection";

const router = express.Router();

// api/v1/prestasi
router.get(
	"/",
	ambilSemuaPrestasi
	/**
	 * #swagger
	 * #swagger.tags = ['Prestasi']
	 * #swagger.path = '/api/v1/prestasi/'
	 * #swagger.description = 'Melihat daftar semua Prestasi.'
	 * #swagger.summary = 'Melihat daftar semua Prestasi.'
	 * #swagger.method = 'get'
	 */
);

// api/v1/prestasi/:prestasi_id
router.get(
	"/:prestasi_id",
	validasiGetPrestasi,
	ambilDetailPrestasi
	/**
	 * #swagger
	 * #swagger.tags = ['Prestasi']
	 * #swagger.path = '/api/v1/prestasi/{:prestasi_id}'
	 * #swagger.description = 'Melihat detail Prestasi berdasarkan ID.'
	 * #swagger.summary = 'Melihat detail Prestasi berdasarkan ID.'
	 * #swagger.method = 'get'
	 * #swagger.parameters[':prestasi_id'] = { in: 'path', description: 'ID Prestasi.', required: true, type: 'string' }
	 */
);

// api/v1/prestasi
router.post(
	"/",
	// csrfProtection,
	authenticateJWT,
	validasiBuatPrestasi,
	buatPrestasi
	/**
	 * #swagger
	 * #swagger.tags = ['Prestasi']
	 * #swagger.path = '/api/v1/prestasi'
	 * #swagger.description = 'Menambahkan Prestasi baru.'
	 * #swagger.summary = 'Menambahkan Prestasi baru.'
	 * #swagger.method = 'post'
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Prestasi' } }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// api/v1/prestasi/:prestasi_id
router.put(
	"/:prestasi_id",
	// csrfProtection,
	authenticateJWT,
	validasiPutPrestasi,
	editPrestasiLengkap
	/**
	 * #swagger
	 * #swagger.tags = ['Prestasi']
	 * #swagger.path = '/api/v1/prestasi/{prestasi_id}'
	 * #swagger.description = 'Mengubah data Prestasi berdasarkan ID.'
	 * #swagger.summary = 'Mengubah data Prestasi berdasarkan ID.'
	 * #swagger.method = 'put'
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/PrestasiReplace' } }
	 * #swagger.parameters['prestasi_id'] = { in: 'path', description: 'ID Prestasi.', required: true, type: 'string' }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// api/v1/prestasi/:prestasi_id
router.patch(
	"/:prestasi_id",
	// csrfProtection,
	authenticateJWT,
	validasiPatchPrestasi,
	editPrestasiSebagian
	/**
	 * #swagger
	 * #swagger.tags = ['Prestasi']
	 * #swagger.path = '/api/v1/prestasi/{prestasi_id}'
	 * #swagger.description = 'Mengubah data Prestasi berdasarkan ID.'
	 * #swagger.summary = 'Mengubah data Prestasi berdasarkan ID.'
	 * #swagger.method = 'patch'
	 * #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/PrestasiUpdate' } }
	 * #swagger.parameters['prestasi_id'] = { in: 'path', description: 'ID Prestasi.', required: true, type: 'string' }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// api/v1/prestasi/:prestasi_id
router.delete(
	"/:prestasi_id",
	// csrfProtection,
	authenticateJWT,
	validasiHapusPrestasi,
	hapusPrestasi
	/**
	 * #swagger
	 * #swagger.tags = ['Prestasi']
	 * #swagger.path = '/api/v1/prestasi/{prestasi_id}'
	 * #swagger.description = 'Menghapus Prestasi berdasarkan ID.'
	 * #swagger.summary = 'Menghapus Prestasi berdasarkan ID.'
	 * #swagger.method = 'delete'
	 * #swagger.parameters['prestasi_id'] = { in: 'path', description: 'ID Prestasi.', required: true, type: 'string' }
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
