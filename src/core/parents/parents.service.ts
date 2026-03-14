import db from "../../shared/config/db";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CreateOrangTuaDto {
	siswaId: string;
	namaAyah: string;
	namaIbu: string;
	pekerjaanAyah?: string;
	pekerjaanIbu?: string;
	teleponAyah?: string;
	teleponIbu?: string;
	alamatOrangTua?: string;
}

export type UpdateOrangTuaDto = Partial<Omit<CreateOrangTuaDto, "siswaId">>;

// ─── Service ───────────────────────────────────────────────────────────────

export class OrangTuaService {
	// ── GET BY SISWA ID ──────────────────────────────────────────────────────
	async getBySiswaId(siswaId: string) {
		// Pastikan siswa ada
		const siswa = await db.siswa.findUnique({
			where: { id: siswaId },
			select: { id: true, nama: true },
		});
		if (!siswa) return null;

		const orangTua = await db.orangTua.findMany({
			where: { siswaId },
			orderBy: { createdAt: "asc" },
		});

		return { siswa, orangTua };
	}

	// ── GET BY ID ────────────────────────────────────────────────────────────
	async getById(id: string) {
		return db.orangTua.findUnique({
			where: { id },
			include: {
				siswa: { select: { id: true, nama: true, nisn: true } },
			},
		});
	}

	// ── CREATE ───────────────────────────────────────────────────────────────
	async create(dto: CreateOrangTuaDto) {
		// Cek siswa ada
		const siswa = await db.siswa.findUnique({
			where: { id: dto.siswaId },
		});
		if (!siswa) {
			throw new Error(`Siswa dengan ID ${dto.siswaId} tidak ditemukan`);
		}

		return db.orangTua.create({ data: dto });
	}

	// ── UPDATE ───────────────────────────────────────────────────────────────
	async update(id: string, dto: UpdateOrangTuaDto) {
		const existing = await db.orangTua.findUnique({ where: { id } });
		if (!existing) return null;

		return db.orangTua.update({ where: { id }, data: dto });
	}

	// ── DELETE ───────────────────────────────────────────────────────────────
	async delete(id: string) {
		const existing = await db.orangTua.findUnique({ where: { id } });
		if (!existing) return null;

		return db.orangTua.delete({ where: { id } });
	}
}

export const orangTuaService = new OrangTuaService();
