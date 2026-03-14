const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

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
		console.warn(`⚠️ Peringatan: File SQL ${fileName}.sql tidak ditemukan. Melewati...`);
		return;
	}

	try {
		const sqlContent = fs.readFileSync(filePath, "utf8");
		let successCount = 0;

		// Pembersihan SQL: Hapus transaksi manual dan komentar
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
		// Jangan throw error di sini supaya proses seed lain tetap jalan jika satu file gagal
	}
}

async function main() {
	console.log("==================================================");
	console.log("🚀 Memulai proses Seeding Data...");

	try {
		// --- LANGKAH 1: DATA MASTER ---
		console.log("📦 Mengisi Data Master...");

		// User & Jenjang (Hanya isi kalau kosong)
		const userCount = await prisma.users.count().catch(() => 0);
		if (userCount === 0) await runSqlFile(sqlFiles.user, "user");

		const jenjangCount = await prisma.jenjang.count().catch(() => 0);
		if (jenjangCount === 0) await runSqlFile(sqlFiles.jenjang, "jenjang");

		// KHUSUS MATA PELAJARAN: Langsung hajar runSqlFile.
		// Mengapa? Karena file SQL kamu sudah pakai 'ON CONFLICT',
		// dan kita menghindari error "Table not found" dari Prisma Client.
		console.log("📖 Memproses Mata Pelajaran...");
		await runSqlFile(sqlFiles.mata_pelajaran, "mata_pelajaran");

		// --- LANGKAH 2: DATA EKSTERNAL / MEDIA ---
		await runSqlFile(sqlFiles.galleries, "galleries");
		await runSqlFile(sqlFiles.social_media, "social_media");

		// --- LANGKAH 3: KONTEN ---
		console.log("📝 Mengisi Data Konten...");
		await runSqlFile(sqlFiles.carousels, "carousels");
		await runSqlFile(sqlFiles.prestasi, "prestasi");
		await runSqlFile(sqlFiles.pengumuman, "pengumuman");
		await runSqlFile(sqlFiles.kegiatan, "kegiatan");

		// --- LANGKAH 4: DATA AKADEMIK ---
		await runSqlFile(sqlFiles.graduation, "graduation");

		if (sqlFiles.subject_grades) {
			await runSqlFile(sqlFiles.subject_grades, "subject_grades");
		}

		await runSqlFile(sqlFiles.pendaftaran, "pendaftaran");
		await runSqlFile(sqlFiles.siswa, "siswa");

		console.log("🏁 Semua proses Seeding selesai dengan sukses!");
	} catch (error) {
		console.error("❌ Seeding dihentikan karena terjadi error fatal.");
		console.error("Detail Error:", error.message);
		process.exit(1);
	}
	console.log("==================================================");
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
