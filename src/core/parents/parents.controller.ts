// src/modules/orangtua/orangtua.controller.ts

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { orangTuaService } from "./parents.service";
import {
	sendSuccess,
	sendCreated,
	sendError,
	sendNotFound,
	sendServerError,
} from "../../shared/utils/response";

export class OrangTuaController {
	// ── GET /siswa/:siswaId/orang-tua ────────────────────────────────────────
	async getBySiswaId(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { siswaId } = req.params;
			const result = await orangTuaService.getBySiswaId(siswaId);

			if (!result) {
				sendNotFound(res, `Siswa dengan ID ${siswaId} tidak ditemukan`);
				return;
			}

			sendSuccess(
				res,
				result.orangTua,
				`Data orang tua siswa ${result.siswa.nama} berhasil diambil`
			);
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// ── GET /orang-tua/:id ───────────────────────────────────────────────────
	async getById(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { id } = req.params;
			const orangTua = await orangTuaService.getById(id);

			if (!orangTua) {
				sendNotFound(res, `Data orang tua dengan ID ${id} tidak ditemukan`);
				return;
			}

			sendSuccess(res, orangTua, "Data orang tua berhasil diambil");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// ── POST /siswa/:siswaId/orang-tua ───────────────────────────────────────
	async create(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { siswaId } = req.params;
			const {
				namaAyah,
				namaIbu,
				pekerjaanAyah,
				pekerjaanIbu,
				teleponAyah,
				teleponIbu,
				alamatOrangTua,
			} = req.body;

			const orangTua = await orangTuaService.create({
				siswaId,
				namaAyah,
				namaIbu,
				pekerjaanAyah,
				pekerjaanIbu,
				teleponAyah,
				teleponIbu,
				alamatOrangTua,
			});

			sendCreated(res, orangTua, "Data orang tua berhasil ditambahkan");
		} catch (error) {
			if (error instanceof Error && error.message.includes("tidak ditemukan")) {
				sendNotFound(res, error.message);
				return;
			}
			sendServerError(res, error);
		}
	}

	// ── PUT /orang-tua/:id ───────────────────────────────────────────────────
	async update(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { id } = req.params;
			const {
				namaAyah,
				namaIbu,
				pekerjaanAyah,
				pekerjaanIbu,
				teleponAyah,
				teleponIbu,
				alamatOrangTua,
			} = req.body;

			const orangTua = await orangTuaService.update(id, {
				...(namaAyah && { namaAyah }),
				...(namaIbu && { namaIbu }),
				...(pekerjaanAyah !== undefined && { pekerjaanAyah }),
				...(pekerjaanIbu !== undefined && { pekerjaanIbu }),
				...(teleponAyah !== undefined && { teleponAyah }),
				...(teleponIbu !== undefined && { teleponIbu }),
				...(alamatOrangTua !== undefined && { alamatOrangTua }),
			});

			if (!orangTua) {
				sendNotFound(res, `Data orang tua dengan ID ${id} tidak ditemukan`);
				return;
			}

			sendSuccess(res, orangTua, "Data orang tua berhasil diperbarui");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// ── DELETE /orang-tua/:id ────────────────────────────────────────────────
	async delete(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { id } = req.params;
			const orangTua = await orangTuaService.delete(id);

			if (!orangTua) {
				sendNotFound(res, `Data orang tua dengan ID ${id} tidak ditemukan`);
				return;
			}

			sendSuccess(res, { id: orangTua.id }, "Data orang tua berhasil dihapus");
		} catch (error) {
			sendServerError(res, error);
		}
	}
}

export const orangTuaController = new OrangTuaController();
