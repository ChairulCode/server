import { Request, Response } from "express";
import carouselService from "./carousels.service";

export const ambilCarouselPublik = async (req: Request, res: Response) => {
	// Query param opsional: ?jenjang=SMA | SMP | SD | PGTK
	const { jenjang } = req.query;
	console.log("------------------------------------------");
	console.log("DEBUG CAROUSEL PUBLIK:");
	console.log("Query Jenjang dari Frontend:", jenjang);
	console.log("------------------------------------------");

	try {
		const result = await carouselService.ambilCarouselPublik(jenjang as string | undefined);

		res.status(200).json({
			message: "Carousel publik berhasil diambil",
			...result,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			serverMessage: error,
		});
	}
};

export const buatCarousel = async (req: Request, res: Response) => {
	try {
		const payload = req.body;

		// ✅ PERBAIKAN: Middleware checkCarouselPermission sudah handle semua validasi:
		// - Auto-assign jenjang_id untuk admin jenjang (line 47-62 di permission_middleware.ts)
		// - Validasi permission berdasarkan role
		// Controller tinggal create saja, tidak perlu validasi ulang

		const result = await carouselService.buatCarousel(payload);
		res.status(201).json({
			message: "Carousel berhasil ditambahkan",
			data: result,
		});
	} catch (error: any) {
		console.error("Error in buatCarousel:", error);

		// Handle error limit 10 carousel
		if (error.message && error.message.includes("Batas maksimal")) {
			return res.status(400).json({
				message: error.message,
			});
		}

		res.status(500).json({
			message: "Server Error",
			serverMessage: error.message || error,
		});
	}
};

export const ambilSemuaCarousel = async (req: Request, res: Response) => {
	const { page = "1", limit = "20" } = req.query;

	// Ambil data dari middleware
	const userRole = (req as any).user?.userInfo?.role || "";
	const allowedJenjangIds = (req as any).allowedJenjangIds;

	try {
		const result = await carouselService.ambilSemuaCarousel(
			Number(page),
			Number(limit),
			userRole,
			allowedJenjangIds
		);

		res.status(200).json({
			message: "Data carousel berhasil diambil",
			...result,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", serverMessage: error });
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
