import { JenisKelamin, Prisma, StatusSiswa } from "@prisma/client";
import db from "../../shared/config/db";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SiswaFilter {
	nama?: string;
	nisn?: string;
	kelas?: string;
	jenisKelamin?: JenisKelamin;
	status?: StatusSiswa;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface CreateSiswaDto {
	nama: string;
	nisn: string;
	alamat: string;
	tanggalLahir: Date;
	jenisKelamin: JenisKelamin;
	kelas: string;
	telepon?: string;
	email?: string;
	status?: StatusSiswa;
}

export type UpdateSiswaDto = Partial<CreateSiswaDto>;

// ─── Service ───────────────────────────────────────────────────────────────

export class SiswaService {
	// ── GET ALL with filter & pagination ────────────────────────────────────
	async getAll(filter: SiswaFilter) {
		const {
			nama,
			nisn,
			kelas,
			jenisKelamin,
			status,
			page = 1,
			limit = 100,
			sortBy = "nama",
			sortOrder = "asc",
		} = filter;

		const where: Prisma.SiswaWhereInput = {
			...(nama && {
				nama: { contains: nama, mode: "insensitive" },
			}),
			...(nisn && { nisn: { contains: nisn } }),
			...(kelas && { kelas: { contains: kelas, mode: "insensitive" } }),
			...(jenisKelamin && { jenisKelamin }),
			...(status && { status }),
		};

		const allowedSortFields: Record<string, boolean> = {
			no: true,
			nama: true,
			nisn: true,
			kelas: true,
			tanggalLahir: true,
			createdAt: true,
		};

		const orderBy: Prisma.SiswaOrderByWithRelationInput = allowedSortFields[sortBy]
			? { [sortBy]: sortOrder }
			: { no: "asc" };

		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			db.siswa.findMany({
				where,
				orderBy,
				skip,
				take: limit,
				include: {
					_count: {
						select: { orangTua: true, nilai: true },
					},
				},
			}),
			db.siswa.count({ where }),
		]);

		return {
			data,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
				hasNextPage: page * limit < total,
				hasPrevPage: page > 1,
			},
		};
	}

	// ── GET BY ID ────────────────────────────────────────────────────────────
	async getById(id: string) {
		return db.siswa.findUnique({
			where: { id },
			include: {
				orangTua: true,
				nilai: {
					orderBy: [{ tahunAjaran: "desc" }, { semester: "asc" }, { mataPelajaran: "asc" }],
				},
				_count: {
					select: { orangTua: true, nilai: true },
				},
			},
		});
	}

	// ── CREATE ───────────────────────────────────────────────────────────────
	async create(dto: CreateSiswaDto) {
		// Cek duplikat NISN
		const existingNisn = await db.siswa.findUnique({
			where: { nisn: dto.nisn },
		});
		if (existingNisn) {
			throw new Error(`NISN ${dto.nisn} sudah terdaftar`);
		}

		// Cek duplikat email jika ada
		if (dto.email) {
			const existingEmail = await db.siswa.findUnique({
				where: { email: dto.email },
			});
			if (existingEmail) {
				throw new Error(`Email ${dto.email} sudah terdaftar`);
			}
		}

		// Auto increment no
		const lastSiswa = await db.siswa.findFirst({
			orderBy: { no: "desc" },
			select: { no: true },
		});
		const no = (lastSiswa?.no ?? 0) + 1;

		return db.siswa.create({
			data: { ...dto, no },
		});
	}

	// ── UPDATE ───────────────────────────────────────────────────────────────
	async update(id: string, dto: UpdateSiswaDto) {
		const existing = await db.siswa.findUnique({ where: { id } });
		if (!existing) return null;

		// Cek duplikat NISN (kecuali diri sendiri)
		if (dto.nisn && dto.nisn !== existing.nisn) {
			const dupNisn = await db.siswa.findUnique({
				where: { nisn: dto.nisn },
			});
			if (dupNisn) {
				throw new Error(`NISN ${dto.nisn} sudah digunakan siswa lain`);
			}
		}

		// Cek duplikat email (kecuali diri sendiri)
		if (dto.email && dto.email !== existing.email) {
			const dupEmail = await db.siswa.findUnique({
				where: { email: dto.email },
			});
			if (dupEmail) {
				throw new Error(`Email ${dto.email} sudah digunakan siswa lain`);
			}
		}

		return db.siswa.update({
			where: { id },
			data: dto,
		});
	}

	// ── DELETE ───────────────────────────────────────────────────────────────
	async delete(id: string) {
		const existing = await db.siswa.findUnique({ where: { id } });
		if (!existing) return null;

		// Cascade delete sudah ditangani Prisma schema (onDelete: Cascade)
		return db.siswa.delete({ where: { id } });
	}

	// ── GET KELAS LIST ────────────────────────────────────────────────────────
	async getKelasList() {
		const result = await db.siswa.findMany({
			select: { kelas: true },
			distinct: ["kelas"],
			orderBy: { kelas: "asc" },
		});
		return result.map((r) => r.kelas);
	}
}

export const siswaService = new SiswaService();
