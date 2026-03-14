import { Request, Response } from "express";
import jenjangService from "./jenjang.service";

export const ambilSemuaJenjang = async (req: Request, res: Response) => {
	try {
		const result = await jenjangService.ambilSemuaJenjang();
		res.status(200).json({
			message: "Jenjang berhasil diambil",
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const ambilDetailJenjang = async (req: Request, res: Response) => {
	const { jenjang_id } = req.params;

	try {
		const result = await jenjangService.ambilDetailJenjang(jenjang_id);

		if (!result) {
			return res.status(404).json({
				message: "Jenjang tidak ditemukan",
				data: null,
			});
		}
		res.status(200).json({
			message: `Jenjang dengan id ${jenjang_id} berhasil diambil`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};
