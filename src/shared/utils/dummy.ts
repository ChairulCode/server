import { PrismaClient, JenisKelamin, Semester, StatusSiswa } from "@prisma/client";
import { fakerID_ID as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const MATA_PELAJARAN = [
	"Matematika",
	"Bahasa Indonesia",
	"Bahasa Inggris",
	"MIPA",
	"IPS",
	"PKN",
	"Penjasorkes",
	"Seni Budaya",
	"Prakarya",
	"Agama",
];

async function main() {
	// --- TRUNCATE / CLEAN UP ---
	console.log("Menghapus data lama...");
	// Cukup delete Siswa, relasi lain (Nilai, OrangTua) otomatis terhapus karena Cascade
	await prisma.siswa.deleteMany();

	// Jika ingin mereset auto increment (opsional, hati-hati jika pakai PostgreSQL/MySQL spesifik)
	// await prisma.$executeRaw`TRUNCATE TABLE siswa RESTART IDENTITY CASCADE`; // Khusus Postgres

	console.log("Mulai seeding...");

	// --- SEEDING ---
	for (let i = 0; i < 100; i++) {
		const sex = faker.helpers.arrayElement([JenisKelamin.L, JenisKelamin.P]);
		const firstName = faker.person.firstName(sex === "L" ? "male" : "female");
		const lastName = faker.person.lastName();
		const fullName = `${firstName} ${lastName}`;

		// Kita push ke array promise untuk eksekusi, atau await satu per satu (disini satu per satu agar aman urutannya)
		await prisma.siswa.create({
			data: {
				nama: fullName,
				nisn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
				alamat: faker.location.streetAddress(),
				tanggalLahir: faker.date.birthdate({ min: 15, max: 18, mode: "age" }),
				jenisKelamin: sex,
				kelas: faker.helpers.arrayElement([
					// TK
					"TK A",
					"TK B",

					// SD
					"1A",
					"1B",
					"2A",
					"2B",
					"3A",
					"3B",
					"4A",
					"4B",
					"5A",
					"5B",
					"6A",
					"6B",

					// SMP
					"7A",
					"7B",
					"7C",
					"8A",
					"8B",
					"8C",
					"9A",
					"9B",
					"9C",

					// SMA/SMK
					"10 MIPA 1",
					"10 MIPA 2",
					"10 IPS 1",
					"10 IPS 2",
					"11 MIPA 1",
					"11 MIPA 2",
					"11 IPS 1",
					"11 IPS 2",
					"12 MIPA 1",
					"12 MIPA 2",
					"12 IPS 1",
					"12 IPS 2",
				]),
				telepon: faker.phone.number(),
				email: faker.internet.email({ firstName, lastName }).toLowerCase(),
				status: StatusSiswa.AKTIF,

				// 1. Create Orang Tua (Relation)
				orangTua: {
					create: {
						namaAyah: faker.person.fullName({ sex: "male" }),
						namaIbu: faker.person.fullName({ sex: "female" }),
						pekerjaanAyah: faker.person.jobTitle(),
						pekerjaanIbu: faker.person.jobTitle(),
						teleponAyah: faker.phone.number(),
						teleponIbu: faker.phone.number(),
						alamatOrangTua: faker.location.streetAddress(),
					},
				},

				// 2. Create 10 Nilai (Relation)
				nilai: {
					create: MATA_PELAJARAN.map((mapel) => ({
						mataPelajaran: mapel,
						semester: faker.helpers.arrayElement([Semester.GANJIL, Semester.GENAP]),
						tahunAjaran: "2023/2024",
						nilaiHarian: faker.number.float({ min: 60, max: 100, fractionDigits: 2 }),
						nilaiUTS: faker.number.float({ min: 50, max: 100, fractionDigits: 2 }),
						nilaiUAS: faker.number.float({ min: 50, max: 100, fractionDigits: 2 }),
						nilaiAkhir: faker.number.float({ min: 60, max: 100, fractionDigits: 2 }),
					})),
				},
			},
		});
	}

	console.log("Seeding selesai: 100 Siswa created (Clean start).");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
