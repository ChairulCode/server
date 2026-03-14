import express from "express";
import { ambilDetailJenjang, ambilSemuaJenjang } from "./jenjang.controller";
import { validasiAmbilDetailJenjang } from "./jenjang.validator";
// import csrfProtection from "../middlewares/csrfProtection";

const router = express.Router();

router.get(
	"/",
	ambilSemuaJenjang
	/**
	 * #swagger
	 * #swagger.tags = ['Jenjang']
	 * #swagger.path = '/api/v1/jenjang/'
	 * #swagger.description = 'Melihat daftar semua Jenjang.'
	 * #swagger.summary = 'Melihat daftar semua Jenjang.'
	 * #swagger.method = 'get'
	 */
);

router.get(
	"/:jenjang_id",
	validasiAmbilDetailJenjang,
	ambilDetailJenjang
	/**
	 * #swagger
	 * #swagger.tags = ['Jenjang']
	 * #swagger.path = '/api/v1/jenjang/{jenjang_id}'
	 * #swagger.description = 'Melihat detail Jenjang berdasarkan Jenjang ID.'
	 * #swagger.summary = 'Melihat detail Jenjang berdasarkan Jenjang ID.'
	 * #swagger.method = 'get'
	 * #swagger.parameters['jenjang_id'] = {in: 'path', description: 'ID Jenjang.', required: true, type: 'string'}
	 */
);

export default router;
