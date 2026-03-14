// src/modules/mata-pelajaran/mata-pelajaran.types.ts
//
// Enum didefinisikan di sini — TIDAK import dari @prisma/client
// sehingga tidak perlu menunggu migration selesai.
// Setelah migration jalan, kedua definisi ini akan konsisten otomatis.
// ─────────────────────────────────────────────────────────────────────────────

export const TINGKATAN_VALUES = [
	"PG_TK",
	"SD_KELAS_RENDAH",
	"SD_KELAS_TINGGI",
	"SMP",
	"SMA_MIPA",
	"SMA_IPS",
] as const;

export type Tingkatan = (typeof TINGKATAN_VALUES)[number];

export const TINGKATAN_LABEL: Record<Tingkatan, string> = {
	PG_TK: "PG / TK",
	SD_KELAS_RENDAH: "SD Kelas Rendah (1–3)",
	SD_KELAS_TINGGI: "SD Kelas Tinggi (4–6)",
	SMP: "SMP",
	SMA_MIPA: "SMA MIPA",
	SMA_IPS: "SMA IPS",
};

export const kelasToTingkatan = (kelas: string): Tingkatan => {
	const k = kelas.trim();
	if (k.startsWith("TK") || k.startsWith("PG")) return "PG_TK";
	if (["1A", "1B", "2A", "2B", "3A", "3B"].includes(k)) return "SD_KELAS_RENDAH";
	if (["4A", "4B", "5A", "5B", "6A", "6B"].includes(k)) return "SD_KELAS_TINGGI";
	if (k.match(/^[789]/)) return "SMP";
	if (k.includes("MIPA")) return "SMA_MIPA";
	if (k.includes("IPS")) return "SMA_IPS";
	return "SMP";
};
