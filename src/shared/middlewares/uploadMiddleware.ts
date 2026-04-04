import multer from "multer";
import path from "path";
import fs from "fs";

// Helper: sanitize nama file — ganti spasi & karakter special jadi underscore
const sanitizeFileName = (originalName: string): string => {
	const ext = path.extname(originalName);
	const base = path.basename(originalName, ext);
	const safeName = base
		.trim()
		.replace(/\s+/g, "_")
		.replace(/[^a-zA-Z0-9._-]/g, "_");
	return safeName + ext;
};

// Dynamic storage — dipakai untuk galleries (achievements, activities, carousels, dll)
const dynamicStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folder = req.params.folder_name || "images";
		const targetPath = path.join("./public", folder);
		if (!fs.existsSync(targetPath)) {
			fs.mkdirSync(targetPath, { recursive: true });
		}
		cb(null, targetPath);
	},
	filename: (req, file, cb) => {
		const safeName = sanitizeFileName(file.originalname);
		cb(null, safeName);
	},
});

export const uploadDynamic = multer({
	storage: dynamicStorage,
	limits: { fileSize: 25 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
		const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
		const mimeOk = allowedTypes.test(file.mimetype);
		if (extOk || mimeOk) {
			cb(null, true);
		} else {
			cb(new Error("Hanya file gambar (JPG, PNG, GIF, WebP, SVG) yang diperbolehkan!"));
		}
	},
});

// Storage khusus untuk pendaftaran (tidak dikompres karena ada PDF)
const pendaftaranStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		const year = new Date().getFullYear();
		const month = String(new Date().getMonth() + 1).padStart(2, "0");

		// ✅ FIX: ganti path.resolve → path.join agar path relatif, bukan absolut
		// path.resolve menyimpan full path Windows: "D:\PROJECT\server\public\..."
		// path.join menyimpan path relatif: "public\pendaftaran\2026-03"
		const targetPath = path.join("public", "pendaftaran", `${year}-${month}`);

		if (!fs.existsSync(targetPath)) {
			fs.mkdirSync(targetPath, { recursive: true });
		}

		cb(null, targetPath);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
	},
});

export const uploadPendaftaran = multer({
	storage: pendaftaranStorage,
	limits: {
		fileSize: 5 * 1024 * 1024,
		fields: 50,
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|pdf/;
		const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

		if (extname) {
			return cb(null, true);
		} else {
			cb(new Error("Hanya file .png, .jpg, .jpeg dan .pdf yang diperbolehkan!"));
		}
	},
});
