import db from "../../shared/config/db";
import fs from "fs";
import path from "path";

const MAX_GAMBAR = 3;
const FOLDER = "ekstrakurikuler";

type EkskulPayload = {
	nama: string;
	deskripsi?: string | null;
	kategori?: string | null;
	hari_latihan?: string | null;
	icon?: string | null;
	urutan?: number | null;
	is_active?: boolean;
};

const hapusFileFisik = (pathGambar: string) => {
	const fullPath = path.join("public", pathGambar);
	try {
		if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
	} catch (err) {
		console.error("Gagal hapus file fisik:", err);
	}
};

const buatEkskul = async (data: EkskulPayload) => {
	return await db.ekstrakurikuler.create({
		data: {
			nama: data.nama,
			deskripsi: data.deskripsi ?? null,
			kategori: data.kategori ?? null,
			hari_latihan: data.hari_latihan ?? null,
			icon: data.icon ?? null,
			urutan: data.urutan ?? null,
			is_active: data.is_active ?? true,
		},
		include: { gambar: { orderBy: { urutan: "asc" } } },
	});
};

const ambilSemuaEkskul = async (page: number, limit: number) => {
	const [data, total] = await Promise.all([
		db.ekstrakurikuler.findMany({
			take: limit,
			skip: (page - 1) * limit,
			orderBy: [{ urutan: "asc" }, { created_at: "desc" }],
			include: { gambar: { orderBy: { urutan: "asc" } } },
		}),
		db.ekstrakurikuler.count(),
	]);
	return {
		metadata: { totalItems: total, totalPages: Math.ceil(total / limit), currentPage: page, limit },
		data,
	};
};

const ambilDetailEkskul = async (ekskul_id: string) => {
	return await db.ekstrakurikuler.findUnique({
		where: { ekskul_id },
		include: { gambar: { orderBy: { urutan: "asc" } } },
	});
};

const editEkskulLengkap = async (ekskul_id: string, data: EkskulPayload) => {
	return await db.ekstrakurikuler.update({
		where: { ekskul_id },
		data: {
			nama: data.nama,
			deskripsi: data.deskripsi ?? null,
			kategori: data.kategori ?? null,
			hari_latihan: data.hari_latihan ?? null,
			icon: data.icon ?? null,
			urutan: data.urutan ?? null,
			is_active: data.is_active ?? true,
		},
		include: { gambar: { orderBy: { urutan: "asc" } } },
	});
};

const editEkskulSebagian = async (ekskul_id: string, data: Partial<EkskulPayload>) => {
	return await db.ekstrakurikuler.update({
		where: { ekskul_id },
		data,
		include: { gambar: { orderBy: { urutan: "asc" } } },
	});
};

const hapusEkskul = async (ekskul_id: string) => {
	const gambarList = await db.ekskul_gambar.findMany({ where: { ekskul_id } });
	for (const gambar of gambarList) hapusFileFisik(gambar.path_gambar);
	return await db.ekstrakurikuler.delete({ where: { ekskul_id } });
};

const uploadGambar = async (ekskul_id: string, filename: string) => {
	const pathGambar = `${FOLDER}/${filename}`;
	const jumlahGambar = await db.ekskul_gambar.count({ where: { ekskul_id } });
	if (jumlahGambar >= MAX_GAMBAR) {
		hapusFileFisik(pathGambar);
		throw new Error(`Maksimal ${MAX_GAMBAR} gambar per ekstrakurikuler.`);
	}
	return await db.ekskul_gambar.create({
		data: { ekskul_id, path_gambar: pathGambar, urutan: jumlahGambar + 1 },
	});
};

const hapusGambar = async (ekskul_id: string, gambar_id: string) => {
	const gambar = await db.ekskul_gambar.findFirst({ where: { gambar_id, ekskul_id } });
	if (!gambar) return null;
	await db.ekskul_gambar.delete({ where: { gambar_id } });
	hapusFileFisik(gambar.path_gambar);
	const sisaGambar = await db.ekskul_gambar.findMany({
		where: { ekskul_id },
		orderBy: { urutan: "asc" },
	});
	for (let i = 0; i < sisaGambar.length; i++) {
		await db.ekskul_gambar.update({
			where: { gambar_id: sisaGambar[i].gambar_id },
			data: { urutan: i + 1 },
		});
	}
	return gambar;
};

export default {
	buatEkskul,
	ambilSemuaEkskul,
	ambilDetailEkskul,
	editEkskulLengkap,
	editEkskulSebagian,
	hapusEkskul,
	uploadGambar,
	hapusGambar,
};
