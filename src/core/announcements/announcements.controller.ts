import { Request, Response } from "express";
import pengumumanService from "./announcements.service";

export const buatPengumuman = async (req: Request, res: Response) => {
	try {
		const result = await pengumumanService.buatPengumuman(req.body);
		res.status(201).json({ message: "Pengumuman berhasil dibuat", data: result });
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const ambilSemuaPengumuman = async (req: Request, res: Response) => {
	const { page = "1", limit = "20" } = req.query;

	try {
		const result = await pengumumanService.ambilSemuaPengumuman(Number(page), Number(limit));
		res.status(200).json({
			message: "Pengumuman berhasil diambil",
			...result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const ambilDetailPengumuman = async (req: Request, res: Response) => {
	const { pengumuman_id } = req.params;

	try {
		const result = await pengumumanService.ambilDetailPengumuman(pengumuman_id);

		if (!result) {
			return res.status(404).json({
				message: "Pengumuman tidak ditemukan",
				data: null,
			});
		}
		res.status(200).json({
			message: `Pengumuman dengan id ${pengumuman_id} berhasil diambil`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editPengumumanLengkap = async (req: Request, res: Response) => {
	const { pengumuman_id } = req.params;
	try {
		const cariPengumuman = await pengumumanService.ambilDetailPengumuman(pengumuman_id);
		if (!cariPengumuman) {
			return res.status(404).json({
				message: "Pengumuman tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await pengumumanService.editPengumumanLengkap(pengumuman_id, req.body);
		res.status(200).json({
			message: `Pengumuman dengan id ${pengumuman_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editPengumumanSebagian = async (req: Request, res: Response) => {
	const { pengumuman_id } = req.params;
	try {
		const cariPengumuman = await pengumumanService.ambilDetailPengumuman(pengumuman_id);
		if (!cariPengumuman) {
			return res.status(404).json({
				message: "Pengumuman tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await pengumumanService.editPengumumanSebagian(pengumuman_id, req.body);
		res.status(200).json({
			message: `Pengumuman dengan id ${pengumuman_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const hapusPengumuman = async (req: Request, res: Response) => {
	const { pengumuman_id } = req.params;
	try {
		const cariPengumuman = await pengumumanService.ambilDetailPengumuman(req.params.Pengumuman_id);
		if (!cariPengumuman) {
			return res.status(404).json({
				message: "Pengumuman tidak ditemukan, Gagal melakukan penghapusan data",
				data: null,
			});
		}

		const result = await pengumumanService.hapusPengumuman(pengumuman_id);
		res.status(200).json({
			message: `Pengumuman dengan id ${pengumuman_id} berhasil dihapus`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};
