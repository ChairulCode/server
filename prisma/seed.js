const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

// ─── MODE ─────────────────────────────────────────────────────────────
// Jalankan dengan: node prisma/seed.js
// Untuk reset konten lama & isi ulang: node prisma/seed.js --reset-content
// ──────────────────────────────────────────────────────────────────────
const RESET_CONTENT = process.argv.includes("--reset-content");

const sqlFiles = {
	user: path.join(__dirname, "seed_data", "user.sql"),
	jenjang: path.join(__dirname, "seed_data", "jenjang.sql"),
	galleries: path.join(__dirname, "seed_data", "galleries.sql"),
	carousels: path.join(__dirname, "seed_data", "carousels.sql"),
	prestasi: path.join(__dirname, "seed_data", "prestasi.sql"),
	pengumuman: path.join(__dirname, "seed_data", "pengumuman.sql"),
	kegiatan: path.join(__dirname, "seed_data", "kegiatan.sql"),
	graduation: path.join(__dirname, "seed_data", "kelulusan.sql"),
	social_media: path.join(__dirname, "seed_data", "social_media.sql"),
	pendaftaran: path.join(__dirname, "seed_data", "pendaftaran.sql"),
	siswa: path.join(__dirname, "seed_data", "siswa.sql"),
	mata_pelajaran: path.join(__dirname, "seed_data", "mapel.sql"),
	// subject_grades: path.join(__dirname, "seed_data", "subject_grades.sql"),
};

async function runSqlFile(filePath, fileName) {
	if (!fs.existsSync(filePath)) {
		console.warn(`⚠️  Peringatan: File SQL ${fileName}.sql tidak ditemukan. Melewati...`);
		return;
	}

	try {
		const sqlContent = fs.readFileSync(filePath, "utf8");
		let successCount = 0;

		// Pembersihan SQL: Hapus transaksi manual dan komentar baris
		let cleanedSql = sqlContent
			.replace(/BEGIN;?/gi, "")
			.replace(/COMMIT;?/gi, "")
			.replace(/--.*$/gm, "")
			.replace(/\n\s*\n/g, "\n");

		const commands = cleanedSql
			.split(";")
			.map((command) => command.trim())
			.filter((command) => command.length > 0);

		console.log(`⏳ Mengeksekusi ${commands.length} perintah dari ${fileName}.sql...`);

		for (const command of commands) {
			await prisma.$executeRawUnsafe(command);
			successCount++;
		}
		console.log(`✅ Sukses: ${fileName}.sql selesai. (${successCount} perintah)`);
	} catch (error) {
		console.error(`❌ Gagal pada file ${fileName}.sql:`, error.message);
	}
}

/**
 * Reset data konten (prestasi & kegiatan) sebelum seed ulang.
 * Urutan delete penting karena ada foreign key:
 * junction tables dulu → baru tabel utama
 */
async function resetContentData() {
	console.log("🗑️  Menghapus data konten lama (prestasi & kegiatan)...");

	try {
		// 1. Hapus junction tables dulu (FK constraint)
		const delPJ = await prisma.prestasi_jenjang.deleteMany({});
		console.log(`   → prestasi_jenjang: ${delPJ.count} baris dihapus`);

		const delKJ = await prisma.kegiatan_jenjang.deleteMany({});
		console.log(`   → kegiatan_jenjang: ${delKJ.count} baris dihapus`);

		// 2. Hapus tabel utama
		const delP = await prisma.prestasi.deleteMany({});
		console.log(`   → prestasi: ${delP.count} baris dihapus`);

		const delK = await prisma.kegiatan.deleteMany({});
		console.log(`   → kegiatan: ${delK.count} baris dihapus`);

		console.log("✅ Reset data konten selesai.\n");
	} catch (error) {
		console.error("❌ Gagal reset data konten:", error.message);
		throw error;
	}
}

async function main() {
	console.log("==================================================");
	console.log("🚀 Memulai proses Seeding Data...");
	if (RESET_CONTENT) {
		console.log("⚠️  MODE: --reset-content aktif (data lama akan dihapus dulu)");
	}
	console.log("==================================================");

	try {
		// ─── LANGKAH 1: DATA MASTER ────────────────────────────
		console.log("\n📦 Mengisi Data Master...");

		const userCount = await prisma.users.count().catch(() => 0);
		if (userCount === 0) await runSqlFile(sqlFiles.user, "user");
		else console.log(`   ℹ️  User sudah ada (${userCount} records), dilewati.`);

		const jenjangCount = await prisma.jenjang.count().catch(() => 0);
		if (jenjangCount === 0) await runSqlFile(sqlFiles.jenjang, "jenjang");
		else console.log(`   ℹ️  Jenjang sudah ada (${jenjangCount} records), dilewati.`);

		console.log("\n📖 Memproses Mata Pelajaran...");
		await runSqlFile(sqlFiles.mata_pelajaran, "mata_pelajaran");

		// ─── LANGKAH 2: MEDIA ──────────────────────────────────
		console.log("\n🖼️  Mengisi Data Media...");
		await runSqlFile(sqlFiles.galleries, "galleries");
		await runSqlFile(sqlFiles.social_media, "social_media");

		// ─── LANGKAH 3: KONTEN (PRESTASI & KEGIATAN) ───────────
		console.log("\n📝 Mengisi Data Konten...");

		// Jika mode reset-content: hapus data lama dulu
		if (RESET_CONTENT) {
			await resetContentData();
		}

		await runSqlFile(sqlFiles.carousels, "carousels");
		await runSqlFile(sqlFiles.prestasi, "prestasi");
		await runSqlFile(sqlFiles.pengumuman, "pengumuman");
		await runSqlFile(sqlFiles.kegiatan, "kegiatan");

		// ─── LANGKAH 4: DATA AKADEMIK ──────────────────────────
		console.log("\n🎓 Mengisi Data Akademik...");
		await runSqlFile(sqlFiles.graduation, "graduation");

		if (sqlFiles.subject_grades) {
			await runSqlFile(sqlFiles.subject_grades, "subject_grades");
		}

		await runSqlFile(sqlFiles.pendaftaran, "pendaftaran");
		await runSqlFile(sqlFiles.siswa, "siswa");

		// ─── SUMMARY ───────────────────────────────────────────
		console.log("\n==================================================");
		console.log("🏁 Semua proses Seeding selesai!");

		const prestasiCount = await prisma.prestasi.count().catch(() => 0);
		const kegiatanCount = await prisma.kegiatan.count().catch(() => 0);
		const pengumumanCount = await prisma.pengumuman.count().catch(() => 0);
		console.log(`   📊 Total prestasi : ${prestasiCount}`);
		console.log(`   📊 Total kegiatan : ${kegiatanCount}`);
		console.log(`   📊 Total pengumuman: ${pengumumanCount}`);
		console.log("==================================================");
	} catch (error) {
		console.error("\n❌ Seeding dihentikan karena terjadi error fatal.");
		console.error("Detail Error:", error.message);
		process.exit(1);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("Gagal saat eksekusi main:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
