import multer from "multer";
import path from "path";
import fs from "fs";

// Existing dynamic storage
const dynamicStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folder = req.params.folder_name || "images";
		const targetPath = path.join("./public", folder);
		cb(null, targetPath);
	},
	filename: (req, file, cb) => {
		cb(null, `${file.originalname}`);
	},
});

export const uploadDynamic = multer({
	storage: dynamicStorage,
	limits: { fileSize: 5 * 1024 * 1024 },
});

// Tambahkan storage khusus untuk pendaftaran
const pendaftaranStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		const year = new Date().getFullYear();
		const month = String(new Date().getMonth() + 1).padStart(2, "0");
		const targetPath = path.resolve(process.cwd(), "public", "pendaftaran", `${year}-${month}`);

		// Create directory if not exists
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

// File filter untuk validasi tipe file

export const uploadPendaftaran = multer({
	storage: pendaftaranStorage,
	limits: {
		fileSize: 5 * 1024 * 1024, // Naikkan ke 5MB per file agar aman
		fields: 50, // Pastikan bisa menampung banyak field teks pendaftaran
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|pdf/;
		const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

		// Terkadang mimetype dari client berbeda, kita prioritaskan cek ekstensi dulu
		if (extname) {
			return cb(null, true);
		} else {
			cb(new Error("Hanya file .png, .jpg, .jpeg dan .pdf yang diperbolehkan!"));
		}
	},
});
