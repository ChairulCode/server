// src/modules/siswa/siswa.controller.ts

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { siswaService } from "./students.service";
import {
	sendSuccess,
	sendCreated,
	sendError,
	sendNotFound,
	sendServerError,
} from "../../shared/utils/response";
import { JenisKelamin, StatusSiswa } from "@prisma/client";

export class SiswaController {
	// ── GET /siswa ───────────────────────────────────────────────────────────
	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { nama, nisn, kelas, jenisKelamin, status, page, limit, sortBy, sortOrder } =
				req.query as Record<string, string>;

			const result = await siswaService.getAll({
				nama,
				nisn,
				kelas,
				jenisKelamin: jenisKelamin as JenisKelamin | undefined,
				status: status as StatusSiswa | undefined,
				page: page ? parseInt(page) : undefined,
				limit: limit ? parseInt(limit) : undefined,
				sortBy,
				sortOrder: sortOrder as "asc" | "desc" | undefined,
			});

			sendSuccess(res, result.data, "Data siswa berhasil diambil");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// ── GET /siswa/:id ───────────────────────────────────────────────────────
	async getById(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { id } = req.params;
			const siswa = await siswaService.getById(id);

			if (!siswa) {
				sendNotFound(res, `Siswa dengan ID ${id} tidak ditemukan`);
				return;
			}

			sendSuccess(res, siswa, "Data siswa berhasil diambil");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// ── POST /siswa ──────────────────────────────────────────────────────────
	async create(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { nama, nisn, alamat, tanggalLahir, jenisKelamin, kelas, telepon, email, status } =
				req.body;

			const siswa = await siswaService.create({
				nama,
				nisn,
				alamat,
				tanggalLahir: new Date(tanggalLahir),
				jenisKelamin,
				kelas,
				telepon,
				email,
				status,
			});

			sendCreated(res, siswa, "Data siswa berhasil ditambahkan");
		} catch (error) {
			if (error instanceof Error && error.message.includes("sudah")) {
				sendError(res, error.message, 409, error.message);
				return;
			}
			sendServerError(res, error);
		}
	}

	// ── PUT /siswa/:id ───────────────────────────────────────────────────────
	async update(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { id } = req.params;
			const { nama, nisn, alamat, tanggalLahir, jenisKelamin, kelas, telepon, email, status } =
				req.body;

			const siswa = await siswaService.update(id, {
				...(nama && { nama }),
				...(nisn && { nisn }),
				...(alamat && { alamat }),
				...(tanggalLahir && { tanggalLahir: new Date(tanggalLahir) }),
				...(jenisKelamin && { jenisKelamin }),
				...(kelas && { kelas }),
				...(telepon !== undefined && { telepon }),
				...(email !== undefined && { email }),
				...(status && { status }),
			});

			if (!siswa) {
				sendNotFound(res, `Siswa dengan ID ${id} tidak ditemukan`);
				return;
			}

			sendSuccess(res, siswa, "Data siswa berhasil diperbarui");
		} catch (error) {
			if (error instanceof Error && error.message.includes("sudah")) {
				sendError(res, error.message, 409, error.message);
				return;
			}
			sendServerError(res, error);
		}
	}

	// ── DELETE /siswa/:id ────────────────────────────────────────────────────
	async delete(req: Request, res: Response): Promise<void> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendError(res, "Validasi gagal", 422, errors.array());
				return;
			}

			const { id } = req.params;
			const siswa = await siswaService.delete(id);

			if (!siswa) {
				sendNotFound(res, `Siswa dengan ID ${id} tidak ditemukan`);
				return;
			}

			sendSuccess(res, { id: siswa.id }, "Data siswa berhasil dihapus");
		} catch (error) {
			sendServerError(res, error);
		}
	}

	// ── GET /siswa/meta/kelas ────────────────────────────────────────────────
	async getKelasList(req: Request, res: Response): Promise<void> {
		try {
			const kelasList = await siswaService.getKelasList();
			sendSuccess(res, kelasList, "Daftar kelas berhasil diambil");
		} catch (error) {
			sendServerError(res, error);
		}
	}
}

export const siswaController = new SiswaController();
