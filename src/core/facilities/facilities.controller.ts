import { Request, Response } from "express";
import fasilitasService from "./facilities.service";

// ─── FASILITAS ────────────────────────────────────────────────────────────────

export const buatFasilitas = async (req: Request, res: Response) => {
	try {
		const result = await fasilitasService.buatFasilitas(req.body);
		res.status(201).json({ message: "Fasilitas berhasil dibuat", data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const ambilSemuaFasilitas = async (req: Request, res: Response) => {
	const { page = "1", limit = "20" } = req.query;

	try {
		const result = await fasilitasService.ambilSemuaFasilitas(Number(page), Number(limit));
		res.status(200).json({ message: "Fasilitas berhasil diambil", ...result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const ambilDetailFasilitas = async (req: Request, res: Response) => {
	const { fasilitas_id } = req.params;

	try {
		const result = await fasilitasService.ambilDetailFasilitas(fasilitas_id);

		if (!result) {
			return res.status(404).json({ message: "Fasilitas tidak ditemukan", data: null });
		}

		res.status(200).json({
			message: `Fasilitas dengan id ${fasilitas_id} berhasil diambil`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const editFasilitasLengkap = async (req: Request, res: Response) => {
	const { fasilitas_id } = req.params;

	try {
		const cari = await fasilitasService.ambilDetailFasilitas(fasilitas_id);
		if (!cari) {
			return res.status(404).json({
				message: "Fasilitas tidak ditemukan, gagal melakukan update",
				data: null,
			});
		}

		const result = await fasilitasService.editFasilitasLengkap(fasilitas_id, req.body);
		res.status(200).json({
			message: `Fasilitas dengan id ${fasilitas_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const editFasilitasSebagian = async (req: Request, res: Response) => {
	const { fasilitas_id } = req.params;

	try {
		const cari = await fasilitasService.ambilDetailFasilitas(fasilitas_id);
		if (!cari) {
			return res.status(404).json({
				message: "Fasilitas tidak ditemukan, gagal melakukan update",
				data: null,
			});
		}

		const result = await fasilitasService.editFasilitasSebagian(fasilitas_id, req.body);
		res.status(200).json({
			message: `Fasilitas dengan id ${fasilitas_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const hapusFasilitas = async (req: Request, res: Response) => {
	const { fasilitas_id } = req.params;

	try {
		const cari = await fasilitasService.ambilDetailFasilitas(fasilitas_id);
		if (!cari) {
			return res.status(404).json({
				message: "Fasilitas tidak ditemukan, gagal menghapus",
				data: null,
			});
		}

		const result = await fasilitasService.hapusFasilitas(fasilitas_id);
		res.status(200).json({
			message: `Fasilitas dengan id ${fasilitas_id} berhasil dihapus`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

// ─── GAMBAR ───────────────────────────────────────────────────────────────────

export const uploadGambarFasilitas = async (req: Request, res: Response) => {
	const { fasilitas_id } = req.params;

	try {
		const cari = await fasilitasService.ambilDetailFasilitas(fasilitas_id);
		if (!cari) {
			return res.status(404).json({ message: "Fasilitas tidak ditemukan", data: null });
		}

		if (!req.file) {
			return res.status(400).json({ message: "File gambar wajib disertakan." });
		}

		// req.file.filename sudah berformat .webp hasil compressImage middleware
		const result = await fasilitasService.uploadGambar(fasilitas_id, req.file.filename);

		res.status(201).json({ message: "Gambar berhasil diupload", data: result });
	} catch (error: any) {
		if (error?.message?.includes("Maksimal")) {
			return res.status(400).json({ message: error.message });
		}
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const hapusGambarFasilitas = async (req: Request, res: Response) => {
	const { fasilitas_id, gambar_id } = req.params;

	try {
		const cari = await fasilitasService.ambilDetailFasilitas(fasilitas_id);
		if (!cari) {
			return res.status(404).json({ message: "Fasilitas tidak ditemukan", data: null });
		}

		const result = await fasilitasService.hapusGambar(fasilitas_id, gambar_id);
		if (!result) {
			return res.status(404).json({ message: "Gambar tidak ditemukan", data: null });
		}

		res.status(200).json({ message: "Gambar berhasil dihapus", data: result });
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};
