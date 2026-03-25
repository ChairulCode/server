import { Request, Response } from "express";
import ekskulService from "./ekskul.service";

export const buatEkskul = async (req: Request, res: Response) => {
	try {
		const result = await ekskulService.buatEkskul(req.body);
		res.status(201).json({ message: "Ekstrakurikuler berhasil dibuat", data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const ambilSemuaEkskul = async (req: Request, res: Response) => {
	const { page = "1", limit = "20" } = req.query;
	try {
		const result = await ekskulService.ambilSemuaEkskul(Number(page), Number(limit));
		res.status(200).json({ message: "Ekstrakurikuler berhasil diambil", ...result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const ambilDetailEkskul = async (req: Request, res: Response) => {
	const { ekskul_id } = req.params;
	try {
		const result = await ekskulService.ambilDetailEkskul(ekskul_id);
		if (!result)
			return res.status(404).json({ message: "Ekstrakurikuler tidak ditemukan", data: null });
		res
			.status(200)
			.json({ message: `Ekstrakurikuler ${ekskul_id} berhasil diambil`, data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const editEkskulLengkap = async (req: Request, res: Response) => {
	const { ekskul_id } = req.params;
	try {
		const cari = await ekskulService.ambilDetailEkskul(ekskul_id);
		if (!cari)
			return res.status(404).json({ message: "Ekstrakurikuler tidak ditemukan", data: null });
		const result = await ekskulService.editEkskulLengkap(ekskul_id, req.body);
		res
			.status(200)
			.json({ message: `Ekstrakurikuler ${ekskul_id} berhasil diupdate`, data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const editEkskulSebagian = async (req: Request, res: Response) => {
	const { ekskul_id } = req.params;
	try {
		const cari = await ekskulService.ambilDetailEkskul(ekskul_id);
		if (!cari)
			return res.status(404).json({ message: "Ekstrakurikuler tidak ditemukan", data: null });
		const result = await ekskulService.editEkskulSebagian(ekskul_id, req.body);
		res
			.status(200)
			.json({ message: `Ekstrakurikuler ${ekskul_id} berhasil diupdate`, data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const hapusEkskul = async (req: Request, res: Response) => {
	const { ekskul_id } = req.params;
	try {
		const cari = await ekskulService.ambilDetailEkskul(ekskul_id);
		if (!cari)
			return res.status(404).json({ message: "Ekstrakurikuler tidak ditemukan", data: null });
		const result = await ekskulService.hapusEkskul(ekskul_id);
		res
			.status(200)
			.json({ message: `Ekstrakurikuler ${ekskul_id} berhasil dihapus`, data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const uploadGambarEkskul = async (req: Request, res: Response) => {
	const { ekskul_id } = req.params;
	try {
		const cari = await ekskulService.ambilDetailEkskul(ekskul_id);
		if (!cari)
			return res.status(404).json({ message: "Ekstrakurikuler tidak ditemukan", data: null });
		if (!req.file) return res.status(400).json({ message: "File gambar wajib disertakan." });
		const result = await ekskulService.uploadGambar(ekskul_id, req.file.filename);
		res.status(201).json({ message: "Gambar berhasil diupload", data: result });
	} catch (error: any) {
		if (error?.message?.includes("Maksimal"))
			return res.status(400).json({ message: error.message });
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const hapusGambarEkskul = async (req: Request, res: Response) => {
	const { ekskul_id, gambar_id } = req.params;
	try {
		const cari = await ekskulService.ambilDetailEkskul(ekskul_id);
		if (!cari)
			return res.status(404).json({ message: "Ekstrakurikuler tidak ditemukan", data: null });
		const result = await ekskulService.hapusGambar(ekskul_id, gambar_id);
		if (!result) return res.status(404).json({ message: "Gambar tidak ditemukan", data: null });
		res.status(200).json({ message: "Gambar berhasil dihapus", data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};
