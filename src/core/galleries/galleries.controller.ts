import { Request, Response, NextFunction } from "express";
import galleriesService from "./galleries.service";

const addPhoto = async (req: Request, res: Response, next: NextFunction) => {
	// Middleware multer sudah berjalan sebelum ini.
	// Jika file gagal diupload multer, req.file akan kosong.
	// if (!req.file) {
	// 	return res.status(400).json({ message: "File foto tidak ditemukan atau format salah." });
	// }

	// // Karena pakai diskStorage, kita ambil filename hasil generate multer
	// const { filename, originalname } = req.file;
	// const { alt } = req.body;

	try {
		// const newPhoto = await galleriesService.addPhoto({
		// 	filename, // Nama file unik di disk (contoh: image-123123.jpg)
		// 	originalName: originalname,
		// 	alt,
		// });

		res.status(201).json({
			message: "Foto berhasil diunggah dan disimpan.",
			data: req.file,
		});
	} catch (error) {
		next(error);
	}
};

const getPhotos = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await galleriesService.getPhotos();
		res.status(200).json({
			message: "success",
			requestedData: data,
		});
	} catch (error) {
		next(error);
	}
};

const getPhotoById = async (req: Request, res: Response, next: NextFunction) => {
	const { pic_id } = req.params;
	try {
		const result = await galleriesService.getPhotoById(pic_id);
		if (!result) return res.status(404).json({ message: "Foto tidak ditemukan" });

		res.status(200).json({ message: "success", data: result });
	} catch (error) {
		next(error);
	}
};

const editPhoto = async (req: Request, res: Response, next: NextFunction) => {
	const { pic_id } = req.params;
	const { alt } = req.body;
	try {
		await galleriesService.editPhoto(pic_id, { alt });
		res.status(200).json({ message: "Photo updated successfully", data: { pic_id, alt } });
	} catch (error) {
		next(error);
	}
};

const deletePhoto = async (req: Request, res: Response, next: NextFunction) => {
	const { pic_id } = req.params;
	try {
		await galleriesService.deletePhoto(pic_id);
		res.status(200).json({ message: "Photo deleted successfully", data: { pic_id } });
	} catch (error) {
		next(error);
	}
};

export default {
	addPhoto,
	getPhotos,
	getPhotoById,
	editPhoto,
	deletePhoto,
};
