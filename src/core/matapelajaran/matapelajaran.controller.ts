// src/core/matapelajaran/matapelajaran.controller.ts

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Tingkatan } from "@prisma/client";
import { mataPelajaranService } from "./matapelajaran.service";
import {
	sendSuccess,
	sendCreated,
	sendError,
	sendNotFound,
	sendServerError,
} from "../../shared/utils/response";

export class MataPelajaranController {
	// GET /mata-pelajaran?kelas=10 IPA 1
	async getByKelas(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}
			const kelas = req.query.kelas as string;
			const result = await mataPelajaranService.getByKelas(kelas);
			sendSuccess(res, result, "Mata pelajaran berhasil diambil");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// GET /mata-pelajaran/all
	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const result = await mataPelajaranService.getAll();
			sendSuccess(res, result, "Semua mata pelajaran berhasil diambil");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// GET /mata-pelajaran/tingkatan/:tingkatan
	async getByTingkatan(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}
			const { tingkatan } = req.params;
			const result = await mataPelajaranService.getByTingkatan(tingkatan as Tingkatan);
			sendSuccess(res, result, `Mata pelajaran ${tingkatan} berhasil diambil`);
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// POST /mata-pelajaran
	async create(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}
			const { kode, nama, tingkatan, urutan } = req.body;
			const result = await mataPelajaranService.create({ kode, nama, tingkatan, urutan });
			sendCreated(res, result, "Mata pelajaran berhasil ditambahkan");
		} catch (error) {
			if (error instanceof Error && error.message.includes("sudah")) {
				sendError(res, error.message, 409, error.message);
				return;
			}
			sendServerError(res, error);
		}
	}

	// PUT /mata-pelajaran/:id
	async update(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}
			const { id } = req.params;
			const { nama, urutan, isActive } = req.body;
			const result = await mataPelajaranService.update(id, {
				...(nama !== undefined && { nama }),
				...(urutan !== undefined && { urutan }),
				...(isActive !== undefined && { isActive }),
			});
			if (!result) {
				sendNotFound(res, `Mata pelajaran dengan ID ${id} tidak ditemukan`);
				return;
			}
			sendSuccess(res, result, "Mata pelajaran berhasil diperbarui");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// DELETE /mata-pelajaran/:id  (soft delete)
	async delete(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}
			const { id } = req.params;
			const result = await mataPelajaranService.softDelete(id);
			if (!result) {
				sendNotFound(res, `Mata pelajaran dengan ID ${id} tidak ditemukan`);
				return;
			}
			sendSuccess(res, { id: result.id }, "Mata pelajaran berhasil dinonaktifkan");
		} catch (error) {
			sendServerError(res, error);
		}
	}
}

export const mataPelajaranController = new MataPelajaranController();
