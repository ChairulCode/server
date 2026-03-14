// src/core/matapelajaran/matapelajaran.service.ts

import { Tingkatan } from "@prisma/client";
import db from "../../shared/config/db";

// ─── Helper ───────────────────────────────────────────────────────────────────

export const kelasToTingkatan = (kelas: string): Tingkatan => {
	const k = kelas.trim();
	if (k.startsWith("TK") || k.startsWith("PG")) return Tingkatan.PG_TK;
	if (["1A", "1B", "2A", "2B", "3A", "3B"].includes(k)) return Tingkatan.SD_KELAS_RENDAH;
	if (["4A", "4B", "5A", "5B", "6A", "6B"].includes(k)) return Tingkatan.SD_KELAS_TINGGI;
	if (k.match(/^[789]/)) return Tingkatan.SMP;
	if (k.includes("MIPA")) return Tingkatan.SMA_MIPA;
	if (k.includes("IPS")) return Tingkatan.SMA_IPS;
	return Tingkatan.SMP;
};

export const TINGKATAN_LABEL: Record<Tingkatan, string> = {
	[Tingkatan.PG_TK]: "PG / TK",
	[Tingkatan.SD_KELAS_RENDAH]: "SD Kelas Rendah (1–3)",
	[Tingkatan.SD_KELAS_TINGGI]: "SD Kelas Tinggi (4–6)",
	[Tingkatan.SMP]: "SMP",
	[Tingkatan.SMA_MIPA]: "SMA IPA",
	[Tingkatan.SMA_IPS]: "SMA IPS",
};

// ─── Service ──────────────────────────────────────────────────────────────────

export class MataPelajaranService {
	async getByKelas(kelas: string) {
		const tingkatan = kelasToTingkatan(kelas);
		const data = await db.mataPelajaran.findMany({
			where: { tingkatan, isActive: true },
			orderBy: { urutan: "asc" },
			select: { kode: true, nama: true, urutan: true },
		});
		return {
			kelas: kelas.trim(),
			tingkatan,
			tingkatanLabel: TINGKATAN_LABEL[tingkatan],
			total: data.length,
			mataPelajaran: data,
		};
	}

	async getByTingkatan(tingkatan: Tingkatan) {
		return db.mataPelajaran.findMany({
			where: { tingkatan, isActive: true },
			orderBy: { urutan: "asc" },
		});
	}

	async getAll() {
		const data = await db.mataPelajaran.findMany({
			where: { isActive: true },
			orderBy: [{ tingkatan: "asc" }, { urutan: "asc" }],
		});

		// Object.values(Tingkatan) works setelah migrate + prisma generate
		return Object.values(Tingkatan).reduce<Record<string, unknown>>((acc, t) => {
			const items = data.filter((d) => d.tingkatan === t);
			acc[t] = {
				label: TINGKATAN_LABEL[t],
				total: items.length,
				mataPelajaran: items,
			};
			return acc;
		}, {});
	}

	async create(dto: { kode: string; nama: string; tingkatan: Tingkatan; urutan: number }) {
		const existing = await db.mataPelajaran.findUnique({ where: { kode: dto.kode } });
		if (existing) throw new Error(`Kode mapel ${dto.kode} sudah digunakan`);
		return db.mataPelajaran.create({ data: dto });
	}

	async update(id: string, dto: Partial<{ nama: string; urutan: number; isActive: boolean }>) {
		const existing = await db.mataPelajaran.findUnique({ where: { id } });
		if (!existing) return null;
		return db.mataPelajaran.update({ where: { id }, data: dto });
	}

	async softDelete(id: string) {
		const existing = await db.mataPelajaran.findUnique({ where: { id } });
		if (!existing) return null;
		return db.mataPelajaran.update({ where: { id }, data: { isActive: false } });
	}
}

export const mataPelajaranService = new MataPelajaranService();
