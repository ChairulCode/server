import { Request, Response } from "express";
import prestasiService from "./achievements.service";

export const buatPrestasi = async (req: Request, res: Response) => {
	try {
		const result = await prestasiService.buatPrestasi(req.body);
		res.status(201).json({ message: "Prestasi berhasil dibuat", data: result });
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const ambilSemuaPrestasi = async (req: Request, res: Response) => {
	const { page = "1", limit = "20" } = req.query;

	try {
		const allowedJenjangIds = (req as any).allowedJenjangIds;
		const result = await prestasiService.ambilSemuaPrestasi(
			Number(page),
			Number(limit),
			allowedJenjangIds
		);
		res.status(200).json({
			message: "Prestasi berhasil diambil",
			...result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const ambilDetailPrestasi = async (req: Request, res: Response) => {
	const { prestasi_id } = req.params;

	try {
		const result = await prestasiService.ambilDetailPrestasi(prestasi_id);

		if (!result) {
			return res.status(404).json({
				message: "Prestasi tidak ditemukan",
				data: null,
			});
		}
		res.status(200).json({
			message: `Prestasi dengan id ${prestasi_id} berhasil diambil`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editPrestasiLengkap = async (req: Request, res: Response) => {
	const { prestasi_id } = req.params;
	try {
		const cariPrestasi = await prestasiService.ambilDetailPrestasi(prestasi_id);
		if (!cariPrestasi) {
			return res.status(404).json({
				message: "Prestasi tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await prestasiService.editPrestasiLengkap(prestasi_id, req.body);
		res.status(200).json({
			message: `Prestasi dengan id ${prestasi_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editPrestasiSebagian = async (req: Request, res: Response) => {
	const { prestasi_id } = req.params;
	try {
		const cariPrestasi = await prestasiService.ambilDetailPrestasi(prestasi_id);
		if (!cariPrestasi) {
			return res.status(404).json({
				message: "Prestasi tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await prestasiService.editPrestasiSebagian(prestasi_id, req.body);
		res.status(200).json({
			message: `Prestasi dengan id ${prestasi_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const hapusPrestasi = async (req: Request, res: Response) => {
	const { prestasi_id } = req.params;
	try {
		const cariPrestasi = await prestasiService.ambilDetailPrestasi(prestasi_id);
		if (!cariPrestasi) {
			return res.status(404).json({
				message: "Prestasi tidak ditemukan, Gagal menghapus",
				data: null,
			});
		}

		const result = await prestasiService.hapusPrestasi(prestasi_id);
		res.status(200).json({
			message: `Prestasi dengan id ${prestasi_id} berhasil dihapus`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};
