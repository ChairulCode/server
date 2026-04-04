import { PrismaClient } from "@prisma/client";
import { generateNoPendaftaran } from "../../shared/utils/generateNoPendaftaran";
import { sendRegistrationNotif } from "../../shared/utils/mailer";

const prisma = new PrismaClient();

export class PendaftaranService {
	// =====================================================
	// CREATE PENDAFTARAN (DENGAN AUTO EMAIL NOTIFICATION)
	// =====================================================
	static async createPendaftaran(data: any) {
		const noPendaftaran = await generateNoPendaftaran();

		const pendaftaranData = {
			namaSiswa: data.namaSiswa,
			kelas: data.kelas,
			tempatLahir: data.tempatLahir,
			tanggalLahir: new Date(data.tanggalLahir),
			jenisKelamin: data.jenisKelamin,
			belajarAgama: data.belajarAgama,
			golonganDarah: data.golonganDarah || null,
			anakKe: parseInt(data.anakKe.toString()),
			jumlahSaudara: parseInt(data.jumlahSaudara.toString()),
			status: data.status,
			alamatSiswa: data.alamatSiswa,
			telpSiswa: data.telpSiswa,
			tinggalBersama: data.tinggalBersama,
			lulusanDariSekolah: data.lulusanDariSekolah || null,
			nisn: data.nisn || null,
			nomorIjazah: data.nomorIjazah || null,
			tglIjazah: data.tglIjazah ? new Date(data.tglIjazah) : null,
			tahunIjazah: data.tahunIjazah ? parseInt(data.tahunIjazah.toString()) : null,
			jumlahNilaiUS: data.jumlahNilaiUS ? parseFloat(data.jumlahNilaiUS.toString()) : null,
			pindahanDariSekolah: data.pindahanDariSekolah || null,
			alamatSekolahAsal: data.alamatSekolahAsal || null,
			emailOrangtua: data.emailOrangTua || data.emailOrangtua,
			namaAyah: data.namaAyah,
			tempatLahirAyah: data.tempatLahirAyah,
			tanggalLahirAyah: new Date(data.tanggalLahirAyah),
			agamaAyah: data.agamaAyah,
			pendidikanAyah: data.pendidikanAyah,
			alamatAyah: data.alamatAyah,
			pekerjaanAyah: data.pekerjaanAyah,
			telpAyah: data.telpAyah,
			namaIbu: data.namaIbu,
			tempatLahirIbu: data.tempatLahirIbu,
			tanggalLahirIbu: new Date(data.tanggalLahirIbu),
			agamaIbu: data.agamaIbu,
			pendidikanIbu: data.pendidikanIbu,
			alamatIbu: data.alamatIbu,
			pekerjaanIbu: data.pekerjaanIbu,
			telpIbu: data.telpIbu,
			akteLahirUrl: data.akteLahir,
			kartuKeluargaUrl: data.kartuKeluarga,
			buktiTransferUrl: data.buktiTransfer,
			noPendaftaran: noPendaftaran,
			statusPendaftaran: "pending",
		};

		const result = await prisma.pendaftaran.create({ data: pendaftaranData });

		console.log("✅ Pendaftaran berhasil disimpan:", result.noPendaftaran);

		if (result.emailOrangtua) {
			try {
				await sendRegistrationNotif({
					userEmail: result.emailOrangtua,
					studentName: result.namaSiswa,
					regNo: result.noPendaftaran,
					status: "pending",
				});
			} catch (emailError: any) {
				console.error("⚠️ GAGAL mengirim email notifikasi:", emailError);
			}
		}

		return result;
	}

	// =====================================================
	// SEND NOTIFICATION
	// =====================================================
	static async sendNotification(pendaftaran_id: string) {
		const data = await prisma.pendaftaran.findUnique({
			where: { id: pendaftaran_id },
			select: {
				id: true,
				noPendaftaran: true,
				namaSiswa: true,
				emailOrangtua: true,
				statusPendaftaran: true,
				createdAt: true,
			},
		});

		if (!data) throw new Error("Data pendaftaran tidak ditemukan");
		if (!data.emailOrangtua) throw new Error("Email orang tua tidak tersedia");
		if (!data.statusPendaftaran) throw new Error("Status pendaftaran tidak ditemukan");

		await sendRegistrationNotif({
			userEmail: data.emailOrangtua,
			studentName: data.namaSiswa,
			regNo: data.noPendaftaran,
			status: data.statusPendaftaran,
		});

		return {
			success: true,
			message: `Email berhasil dikirim ulang ke ${data.emailOrangtua}`,
			emailSent: true,
		};
	}

	// =====================================================
	// GET ALL PENDAFTARAN
	// =====================================================
	static async getAllPendaftaran(filters?: {
		page?: number;
		limit?: number;
		status?: string;
		kelas?: string;
		search?: string;
	}) {
		const page = Number(filters?.page) || 1;
		const limit = Number(filters?.limit) || 10;
		const skip = (page - 1) * limit;

		const where: any = {};

		if (filters?.status && filters.status !== "all") {
			where.statusPendaftaran = filters.status;
		}

		if (filters?.kelas && filters.kelas !== "all") {
			where.kelas = {
				startsWith: filters.kelas,
				mode: "insensitive",
			};
		}

		if (filters?.search) {
			where.OR = [
				{ namaSiswa: { contains: filters.search, mode: "insensitive" } },
				{ noPendaftaran: { contains: filters.search, mode: "insensitive" } },
				{ emailOrangtua: { contains: filters.search, mode: "insensitive" } },
			];
		}

		const [data, total] = await Promise.all([
			prisma.pendaftaran.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.pendaftaran.count({ where }),
		]);

		return {
			success: true,
			data,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	// =====================================================
	// GET BY ID
	// =====================================================
	static async getPendaftaranById(id: string) {
		const pendaftaran = await prisma.pendaftaran.findUnique({ where: { id } });
		if (!pendaftaran) throw new Error("Data pendaftaran tidak ditemukan");
		return pendaftaran;
	}

	// =====================================================
	// UPDATE STATUS
	// =====================================================
	static async updateStatusPendaftaran(id: string, data: { status: string }) {
		const exists = await prisma.pendaftaran.findUnique({ where: { id } });
		if (!exists) throw new Error("Data pendaftaran tidak ditemukan");

		const updated = await prisma.pendaftaran.update({
			where: { id },
			data: {
				statusPendaftaran: data.status,
				updatedAt: new Date(),
			},
		});

		return updated;
	}

	// =====================================================
	// DELETE
	// =====================================================
	static async deletePendaftaran(id: string) {
		const exists = await prisma.pendaftaran.findUnique({ where: { id } });
		if (!exists) throw new Error("Data pendaftaran tidak ditemukan");
		return prisma.pendaftaran.delete({ where: { id } });
	}

	// =====================================================
	// ✅ STATISTICS — dengan filter kelas per role
	// Kepala Sekolah SMA hanya dapat statistik SMA
	// Kepala Sekolah SD hanya dapat statistik SD, dst.
	// =====================================================
	static async getStatistics(role?: string) {
		// ✅ Mapping role → prefix kelas yang diizinkan
		// Konsisten dengan ROLE_KELAS_MAP di frontend use-permission.ts
		const ROLE_KELAS_PREFIX: Record<string, string[]> = {
			"Super Administrator": [], // kosong = semua
			Admin: [], // kosong = semua
			"Kepala Sekolah SMA": ["SMA"],
			"Kepala Sekolah SMP": ["SMP"],
			"Kepala Sekolah SD": ["SD"],
			"Kepala Sekolah PGTK": ["PG", "TK"],
		};

		const prefixes = role ? (ROLE_KELAS_PREFIX[role] ?? []) : [];
		const isAllAccess = prefixes.length === 0;

		// ✅ Build where clause untuk filter kelas
		// Jika prefixes kosong (superadmin/admin) → tidak ada filter → hitung semua
		const buildWhere = (extraWhere?: object) => {
			if (isAllAccess) return extraWhere ?? {};

			// OR: kelas startsWith "SMA" OR startsWith "SMP" dst.
			return {
				...extraWhere,
				OR: prefixes.map((prefix) => ({
					kelas: { startsWith: prefix, mode: "insensitive" as const },
				})),
			};
		};

		const [total, pending, approved, rejected] = await Promise.all([
			prisma.pendaftaran.count({ where: buildWhere() }),
			prisma.pendaftaran.count({ where: buildWhere({ statusPendaftaran: "pending" }) }),
			prisma.pendaftaran.count({ where: buildWhere({ statusPendaftaran: "approved" }) }),
			prisma.pendaftaran.count({ where: buildWhere({ statusPendaftaran: "rejected" }) }),
		]);

		return { total, pending, approved, rejected };
	}
}
