import { Request, Response } from "express";
import carouselService from "./carousels.service";

export const buatCarousel = async (req: Request, res: Response) => {
	try {
		const result = await carouselService.buatCarousel(req.body);
		res.status(201).json({ message: "Carousel berhasil dibuat", data: result });
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const ambilSemuaCarousel = async (req: Request, res: Response) => {
	const { page = "1", limit = "20" } = req.query;

	try {
		const result = await carouselService.ambilSemuaCarousel(Number(page), Number(limit));
		res.status(200).json({
			message: "Carousel berhasil diambil",
			...result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const ambilDetailCarousel = async (req: Request, res: Response) => {
	const { carousel_id } = req.params;

	try {
		const result = await carouselService.ambilDetailCarousel(carousel_id);

		if (!result) {
			return res.status(404).json({
				message: "Carousel tidak ditemukan",
				data: null,
			});
		}
		res.status(200).json({
			message: `Carousel dengan id ${carousel_id} berhasil diambil`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editCarouselLengkap = async (req: Request, res: Response) => {
	const { carousel_id } = req.params;
	try {
		const cariCarousel = await carouselService.ambilDetailCarousel(carousel_id);
		if (!cariCarousel) {
			return res.status(404).json({
				message: "Carousel tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await carouselService.editCarouselLengkap(carousel_id, req.body);
		res.status(200).json({
			message: `Carousel dengan id ${carousel_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const editCarouselSebagian = async (req: Request, res: Response) => {
	const { carousel_id } = req.params;
	try {
		const cariCarousel = await carouselService.ambilDetailCarousel(carousel_id);
		if (!cariCarousel) {
			return res.status(404).json({
				message: "Carousel tidak ditemukan, Gagal melakukan update data",
				data: null,
			});
		}

		const result = await carouselService.editCarouselSebagian(carousel_id, req.body);
		res.status(200).json({
			message: `Carousel dengan id ${carousel_id} berhasil diupdate`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const hapusCarousel = async (req: Request, res: Response) => {
	const { carousel_id } = req.params;
	try {
		const cariCarousel = await carouselService.ambilDetailCarousel(carousel_id);
		if (!cariCarousel) {
			return res.status(404).json({
				message: "Carousel tidak ditemukan, Gagal menghapus",
				data: null,
			});
		}

		const result = await carouselService.hapusCarousel(carousel_id);
		res.status(200).json({
			message: `Carousel dengan id ${carousel_id} berhasil dihapus`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};
