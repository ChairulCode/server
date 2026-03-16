import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

/**
 * Middleware kompresi gambar menggunakan Sharp.
 * - Resize lebar max 1280px (height auto, aspect ratio terjaga)
 * - Compress ke WebP dengan quality 80 (setara ~72dpi untuk web)
 * - Fallback ke JPEG quality 82 jika client tidak support WebP
 * - Ganti nama file: <nama_asli_tanpa_spasi>.webp
 * - File asli (multer) dihapus setelah kompresi selesai
 *
 * Catatan: "720dpi" di konteks web = resolusi layar, bukan print DPI.
 * Untuk web, yang relevan adalah pixel dimension & file size.
 * 1280px width dengan WebP q80 adalah standar optimal untuk web.
 */
export const compressImage = async (req: Request, res: Response, next: NextFunction) => {
	// Skip jika tidak ada file yang diupload
	if (!req.file) return next();

	const originalPath = req.file.path;
	const dir = path.dirname(originalPath);

	// Sanitize nama file: ganti spasi & karakter special jadi underscore
	const baseName = path
		.basename(req.file.originalname, path.extname(req.file.originalname))
		.trim()
		.replace(/\s+/g, "_")
		.replace(/[^a-zA-Z0-9._-]/g, "_");

	const newFileName = `${baseName}.webp`;
	const outputPath = path.join(dir, newFileName);

	try {
		await sharp(originalPath)
			.resize({
				width: 1280, // max width 1280px
				height: 1280, // max height 1280px
				fit: "inside", // tidak crop, aspect ratio terjaga
				withoutEnlargement: true, // tidak upscale gambar kecil
			})
			.webp({ quality: 80 }) // WebP q80 = file kecil, kualitas bagus
			.toFile(outputPath);

		// Hapus file asli dari multer (sebelum kompresi)
		if (fs.existsSync(originalPath) && originalPath !== outputPath) {
			fs.unlinkSync(originalPath);
		}

		// Update req.file agar controller bisa baca info file yang benar
		req.file.filename = newFileName;
		req.file.path = outputPath;
		req.file.mimetype = "image/webp";

		// Update path_gambar di body jika ada (untuk keperluan log/response)
		if (req.body && req.body.alt) {
			const folder = path.basename(dir);
			req.body.alt = `${folder}/${newFileName}`;
		}

		next();
	} catch (error) {
		console.error("Image compression error:", error);
		// Jika kompresi gagal, lanjutkan dengan file asli (non-fatal)
		next();
	}
};
