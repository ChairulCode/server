const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const folders = ["achievements", "activities", "carousels"];

async function convertToWebP() {
	let totalConverted = 0;
	let totalSkipped = 0;
	let totalSavedKB = 0;

	for (const folder of folders) {
		const folderPath = path.join("./public", folder);

		if (!fs.existsSync(folderPath)) {
			console.log(`Folder ${folder} tidak ditemukan, skip.`);
			continue;
		}

		const files = fs.readdirSync(folderPath).filter((f) => /\.(jpg|jpeg|png|gif)$/i.test(f));

		if (files.length === 0) {
			console.log(`[${folder}] Tidak ada file yang perlu dikonversi.`);
			continue;
		}

		console.log(
			`\n========== CONVERTING ${folder.toUpperCase()} (${files.length} files) ==========`
		);

		for (const file of files) {
			const inputPath = path.join(folderPath, file);

			// Sanitize nama: ganti spasi & karakter special jadi underscore
			const baseName = path
				.basename(file, path.extname(file))
				.trim()
				.replace(/\s+/g, "_")
				.replace(/[^a-zA-Z0-9._-]/g, "_");

			const outputFileName = baseName + ".webp";
			const outputPath = path.join(folderPath, outputFileName);

			// Skip jika output sudah ada
			if (fs.existsSync(outputPath)) {
				console.log(`  SKIP   : ${file} → ${outputFileName} (sudah ada)`);
				totalSkipped++;
				continue;
			}

			try {
				const originalSize = fs.statSync(inputPath).size;

				await sharp(inputPath)
					.resize({
						width: 1280,
						height: 1280,
						fit: "inside",
						withoutEnlargement: true,
					})
					.webp({ quality: 80 })
					.toFile(outputPath);

				const newSize = fs.statSync(outputPath).size;
				const savedKB = ((originalSize - newSize) / 1024).toFixed(2);
				const originalKB = (originalSize / 1024).toFixed(2);
				const newKB = (newSize / 1024).toFixed(2);

				totalSavedKB += parseFloat(savedKB);
				totalConverted++;

				console.log(`  OK     : ${file} → ${outputFileName}`);
				console.log(`           ${originalKB} KB → ${newKB} KB (hemat ${savedKB} KB)`);

				// Hapus file lama setelah konversi berhasil
				fs.unlinkSync(inputPath);
				console.log(`           File lama dihapus.`);
			} catch (err) {
				console.log(`  ERROR  : ${file} — ${err.message}`);
			}
		}
	}

	console.log("\n========== SELESAI ==========");
	console.log(`Total dikonversi : ${totalConverted} file`);
	console.log(`Total di-skip    : ${totalSkipped} file`);
	console.log(`Total hemat      : ${totalSavedKB.toFixed(2)} KB`);
	console.log("\nCatatan: path_gambar di database perlu diupdate juga!");
	console.log("Jalankan: node update-db-paths.js");
}

convertToWebP();
