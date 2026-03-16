const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Folder yang mau dicek
const folders = ["achievements", "activities", "carousels"];

async function checkImages() {
	for (const folder of folders) {
		const folderPath = path.join("./public", folder);

		if (!fs.existsSync(folderPath)) {
			console.log(`Folder ${folder} tidak ditemukan, skip.`);
			continue;
		}

		const files = fs.readdirSync(folderPath).filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f));

		if (files.length === 0) {
			console.log(`[${folder}] Tidak ada gambar.`);
			continue;
		}

		console.log(`\n========== ${folder.toUpperCase()} ==========`);

		for (const file of files.slice(0, 5)) {
			// cek 5 file pertama saja
			const filePath = path.join(folderPath, file);
			try {
				const meta = await sharp(filePath).metadata();
				const sizeKB = (fs.statSync(filePath).size / 1024).toFixed(2);
				console.log(`File   : ${file}`);
				console.log(`Format : ${meta.format}`);
				console.log(`Size   : ${meta.width} x ${meta.height} px`);
				console.log(`Weight : ${sizeKB} KB`);
				console.log("---");
			} catch (e) {
				console.log(`${file}: gagal dibaca`);
			}
		}
	}
}

checkImages();
