import { Request, Response } from "express";
import aboutService from "./about.service";

/**
 * GET /api/v1/about/publik?jenjang=SMA
 * Public — ambil about berdasarkan kode_jenjang
 *
 * ✅ FIX: response sekarang konsisten pakai { message, data }
 * bukan spread ...result, agar frontend bisa baca response.data dengan pasti
 */
export const ambilAboutPublik = async (req: Request, res: Response) => {
	const { jenjang } = req.query;

	console.log("------------------------------------------");
	console.log("DEBUG ABOUT PUBLIK:");
	console.log("Query Jenjang dari Frontend:", jenjang);
	console.log("------------------------------------------");

	try {
		const result = await aboutService.ambilAboutPublik(jenjang as string | undefined);

		// ✅ Selalu kirim { message, data } — bukan spread
		// Ini membuat frontend bisa konsisten akses response.data
		return res.status(200).json({
			message: "About publik berhasil diambil",
			data: result.data, // objek about atau null
			jenjang: result.jenjang, // info jenjang atau null
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const buatAbout = async (req: Request, res: Response) => {
	try {
		const payload = req.body;
		const result = await aboutService.buatAbout(payload);

		return res.status(201).json({
			message: "About berhasil ditambahkan",
			data: result,
		});
	} catch (error: any) {
		console.error("Error in buatAbout:", error);

		if (error.message && error.message.includes("sudah ada")) {
			return res.status(400).json({
				message: error.message,
			});
		}

		return res.status(500).json({
			message: "Server Error",
			serverMessage: error.message || error,
		});
	}
};

export const ambilSemuaAbout = async (req: Request, res: Response) => {
	const { page = "1", limit = "20" } = req.query;

	const userRole = (req as any).user?.userInfo?.role || "";
	const allowedJenjangIds = (req as any).allowedJenjangIds;

	try {
		const result = await aboutService.ambilSemuaAbout(
			Number(page),
			Number(limit),
			userRole,
			allowedJenjangIds
		);

		return res.status(200).json({
			message: "Data about berhasil diambil",
			...result,
		});
	} catch (error) {
		return res.status(500).json({ message: "Server Error", serverMessage: error });
	}
};

export const ambilDetailAbout = async (req: Request, res: Response) => {
	const { about_id } = req.params;

	try {
		const result = await aboutService.ambilDetailAbout(about_id);

		if (!result) {
			return res.status(404).json({
				message: "About tidak ditemukan",
				data: null,
			});
		}

		return res.status(200).json({
			message: `About dengan id ${about_id} berhasil diambil`,
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editAboutLengkap = async (req: Request, res: Response) => {
	const { about_id } = req.params;

	try {
		const cariAbout = await aboutService.ambilDetailAbout(about_id);
		if (!cariAbout) {
			return res.status(404).json({
				message: "About tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await aboutService.editAboutLengkap(about_id, req.body);

		return res.status(200).json({
			message: `About dengan id ${about_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editAboutSebagian = async (req: Request, res: Response) => {
	const { about_id } = req.params;

	try {
		const cariAbout = await aboutService.ambilDetailAbout(about_id);
		if (!cariAbout) {
			return res.status(404).json({
				message: "About tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await aboutService.editAboutSebagian(about_id, req.body);

		return res.status(200).json({
			message: `About dengan id ${about_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const hapusAbout = async (req: Request, res: Response) => {
	const { about_id } = req.params;

	try {
		const cariAbout = await aboutService.ambilDetailAbout(about_id);
		if (!cariAbout) {
			return res.status(404).json({
				message: "About tidak ditemukan, Gagal menghapus",
				data: null,
			});
		}

		const result = await aboutService.hapusAbout(about_id);

		return res.status(200).json({
			message: `About dengan id ${about_id} berhasil dihapus`,
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};
