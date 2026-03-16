/**
 * Script update path_gambar di database setelah konversi gambar ke WebP
 * Jalankan SETELAH convert-images.js selesai
 *
 * Cara pakai:
 *   node update-db-paths.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper: sanitize nama file (sama dengan di imageCompression.ts)
function sanitizeBaseName(name) {
	return name
		.trim()
		.replace(/\s+/g, "_")
		.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// Konversi path lama ke path baru
// Contoh: "achievements/0001 copy.jpg" → "achievements/0001_copy.webp"
function convertPath(oldPath) {
	if (!oldPath) return oldPath;

	try {
		// Handle JSON array (multi-image)
		if (oldPath.startsWith("[")) {
			const arr = JSON.parse(oldPath);
			const converted = arr.map((p) => convertPath(p));
			return JSON.stringify(converted);
		}

		const parts = oldPath.split("/");
		const folder = parts[0]; // achievements, activities, carousels
		const fileName = parts.slice(1).join("/"); // nama file (bisa ada subfolder)

		const ext = fileName.lastIndexOf(".");
		const baseName = ext !== -1 ? fileName.substring(0, ext) : fileName;
		const safeBase = sanitizeBaseName(baseName);
		const newFileName = safeBase + ".webp";

		return `${folder}/${newFileName}`;
	} catch {
		return oldPath;
	}
}

async function updatePaths() {
	console.log("Memulai update path_gambar di database...\n");
	let totalUpdated = 0;

	// ── UPDATE PRESTASI ──
	try {
		const prestasi = await prisma.prestasi.findMany({
			select: { prestasi_id: true, path_gambar: true },
		});

		console.log(`Prestasi: ${prestasi.length} data ditemukan`);
		for (const item of prestasi) {
			const newPath = convertPath(item.path_gambar);
			if (newPath !== item.path_gambar) {
				await prisma.prestasi.update({
					where: { prestasi_id: item.prestasi_id },
					data: { path_gambar: newPath },
				});
				console.log(`  [prestasi] ${item.path_gambar} → ${newPath}`);
				totalUpdated++;
			}
		}
	} catch (e) {
		console.log("  Prestasi skip:", e.message);
	}

	// ── UPDATE KEGIATAN ──
	try {
		const kegiatan = await prisma.kegiatan.findMany({
			select: { kegiatan_id: true, path_gambar: true },
		});

		console.log(`\nKegiatan: ${kegiatan.length} data ditemukan`);
		for (const item of kegiatan) {
			const newPath = convertPath(item.path_gambar);
			if (newPath !== item.path_gambar) {
				await prisma.kegiatan.update({
					where: { kegiatan_id: item.kegiatan_id },
					data: { path_gambar: newPath },
				});
				console.log(`  [kegiatan] ${item.path_gambar} → ${newPath}`);
				totalUpdated++;
			}
		}
	} catch (e) {
		console.log("  Kegiatan skip:", e.message);
	}

	// ── UPDATE CAROUSEL ──
	try {
		const carousels = await prisma.carousel.findMany({
			select: { carousel_id: true, path_gambar: true },
		});

		console.log(`\nCarousel: ${carousels.length} data ditemukan`);
		for (const item of carousels) {
			const newPath = convertPath(item.path_gambar);
			if (newPath !== item.path_gambar) {
				await prisma.carousel.update({
					where: { carousel_id: item.carousel_id },
					data: { path_gambar: newPath },
				});
				console.log(`  [carousel] ${item.path_gambar} → ${newPath}`);
				totalUpdated++;
			}
		}
	} catch (e) {
		console.log("  Carousel skip:", e.message);
	}

	console.log(`\n========== SELESAI ==========`);
	console.log(`Total diupdate: ${totalUpdated} record`);

	await prisma.$disconnect();
}

updatePaths().catch(async (e) => {
	console.error(e);
	await prisma.$disconnect();
	process.exit(1);
});
