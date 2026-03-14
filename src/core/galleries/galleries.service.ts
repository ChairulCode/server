import db from "../../shared/config/db";
import { galleries } from "@prisma/client";
import fs from "fs";
import path from "path";

export type AddPhotoPayload = {
	filename: string; // Nama file yang tersimpan di disk
	originalName: string; // Nama asli file dari user
	alt: string;
};

export type EditPhotoPayload = {
	alt: string;
};

// Sesuaikan folder ini dengan setup multer kamu
// Jika multer simpan di './public/images', maka folderNameDB 'images'
const FOLDER_NAME = "images";

const addPhoto = async ({ filename, alt }: AddPhotoPayload): Promise<galleries> => {
	// Path yang disimpan di DB adalah path relatif untuk akses URL
	// Contoh output: "images/foto-123.jpg"
	// Frontend nanti tinggal tambah base_url: http://localhost:3000/images/foto-123.jpg

	try {
		const result = await db.galleries.create({
			data: {
				alt: alt,
				path_file: filename,
			},
		});
		return result;
	} catch (error) {
		// Jika simpan DB gagal, HAPUS file yang sudah terlanjur diupload multer
		// Agar tidak jadi file sampah
		const filePath = path.join("public", FOLDER_NAME, filename);
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
		throw error;
	}
};

const getPhotos = async (): Promise<galleries[]> => {
	return await db.galleries.findMany({
		orderBy: { created_at: "desc" },
	});
};

const getPhotoById = async (pic_id: string): Promise<galleries | null> => {
	return await db.galleries.findUnique({
		where: { pic_id },
	});
};

const editPhoto = async (pic_id: string, { alt }: EditPhotoPayload): Promise<galleries> => {
	return await db.galleries.update({
		where: { pic_id },
		data: { alt },
	});
};

const deletePhoto = async (pic_id: string): Promise<galleries> => {
	// 1. Cari data di DB
	const galleryItem = await db.galleries.findUnique({ where: { pic_id } });

	if (!galleryItem) {
		throw new Error("Foto tidak ditemukan di database.");
	}

	// 2. Hapus data dari DB
	const result = await db.galleries.delete({ where: { pic_id } });

	// 3. Hapus File Fisik di folder Public
	// galleryItem.path_file isinya misal: "images/foto-123.jpg"
	// Kita perlu full path system: "public/images/foto-123.jpg"
	const fullPath = path.join("public", galleryItem.path_file);

	try {
		// Cek apakah file ada sebelum dihapus
		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath); // Hapus file
		} else {
			console.warn("File fisik tidak ditemukan, hanya data DB yang dihapus:", fullPath);
		}
	} catch (err) {
		console.error("Gagal menghapus file fisik:", err);
		// Kita tidak throw error di sini agar response tetap sukses (karena DB sudah terhapus)
	}

	return result;
};

export default {
	addPhoto,
	getPhotos,
	getPhotoById,
	editPhoto,
	deletePhoto,
};
