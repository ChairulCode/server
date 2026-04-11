import db from "../../shared/config/db";

// ── Buat data kelulusan ───────────────────────────────────────
const buatKelulusan = async (data: any, user: any) => {
	const penulis_user_id = (user as any).userInfo?.user_id ?? user.user_id;

	if (!penulis_user_id) throw new Error("Gagal membaca User ID. Struktur token tidak sesuai.");

	return await db.kelulusan.create({
		data: {
			...data,
			tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
			penulis_user_id,
		},
	});
};

// ── Ambil semua kelulusan (admin) ─────────────────────────────
const ambilSemuaKelulusan = async (
	page: number,
	limit: number,
	jenjang_id?: string,
	search?: string
) => {
	const where: any = {};

	if (jenjang_id) where.jenjang_id = jenjang_id;

	if (search) {
		where.OR = [
			{
				nama_siswa: {
					contains: search,
					// mode: "insensitive"
				},
			},
			{
				nomor_siswa: {
					contains: search,
					// mode: "insensitive"
				},
			},
			{
				jenjang: {
					nama_jenjang: {
						contains: search,
						// mode: "insensitive"
					},
				},
			},
		];
	}

	const [result, total] = await Promise.all([
		db.kelulusan.findMany({
			where,
			take: limit,
			skip: (page - 1) * limit,
			orderBy: { nama_siswa: "asc" },
			include: { jenjang: true },
		}),
		db.kelulusan.count({ where }),
	]);

	return {
		metadata: {
			totalItems: total,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
			limit,
		},
		data: result,
	};
};

// ── Ambil daftar tahun ajaran yang tersedia (publik) ──────────
// Digunakan client untuk menampilkan pill "T.P. XXXX/XXXX" secara dinamis
const ambilTahunAjaranTersedia = async () => {
	const rows = await db.kelulusan.findMany({
		select: { tahun_ajaran: true },
		distinct: ["tahun_ajaran"],
		orderBy: { tahun_ajaran: "desc" },
	});
	return rows.map((r) => r.tahun_ajaran);
};

// ── Cek status lulus (endpoint lama, publik) ──────────────────
const cekStatusLulus = async (nomor_siswa: string) => {
	return await db.kelulusan.findFirst({
		where: { nomor_siswa },
		include: { jenjang: true },
	});
};

// ── Cek kelulusan siswa dengan verifikasi tanggal lahir ───────
// tahun_ajaran sekarang OPSIONAL:
//   - Jika dikirim → cari by nomor_siswa + tahun_ajaran
//   - Jika tidak dikirim (atau kosong) → cari by nomor_siswa saja,
//     ambil data dengan tahun_ajaran terbaru
const cekKelulusanSiswa = async (
	nomor_siswa: string,
	tanggal_lahir: string,
	tahun_ajaran?: string
) => {
	// Parse YYYYMMDD → Date
	const y = parseInt(tanggal_lahir.substring(0, 4));
	const m = parseInt(tanggal_lahir.substring(4, 6)) - 1;
	const d = parseInt(tanggal_lahir.substring(6, 8));
	const tglInput = new Date(y, m, d);

	// Cari data kelulusan
	let result;
	if (tahun_ajaran && tahun_ajaran.trim() !== "") {
		result = await db.kelulusan.findFirst({
			where: { nomor_siswa, tahun_ajaran },
			include: { jenjang: true },
		});
	} else {
		// Ambil data paling baru berdasarkan tahun_ajaran desc
		result = await db.kelulusan.findFirst({
			where: { nomor_siswa },
			include: { jenjang: true },
			orderBy: { tahun_ajaran: "desc" },
		});
	}

	// Tidak ditemukan
	if (!result) return { found: false };

	// Tanggal lahir belum diisi admin → anggap tidak ditemukan (aman)
	if (!result.tanggal_lahir) return { found: false };

	// Bandingkan tanggal lahir
	const tglDb = new Date(result.tanggal_lahir);
	const cocok =
		tglDb.getFullYear() === tglInput.getFullYear() &&
		tglDb.getMonth() === tglInput.getMonth() &&
		tglDb.getDate() === tglInput.getDate();

	if (!cocok) return { found: false };

	// Cek konfigurasi tanggal akses
	const config = await db.graduation_config.findFirst({
		where: {
			kelas: result.kelas,
			tahun_ajaran: result.tahun_ajaran,
			is_active: true,
		},
	});

	const aksesValid = !config || new Date() >= new Date(config.tanggal_akses);

	return {
		found: true,
		aksesValid,
		tanggal_akses: config?.tanggal_akses ?? null,
		data: aksesValid ? result : null,
	};
};

// ── Edit data kelulusan ───────────────────────────────────────
const editKelulusan = async (kelulusan_id: string, data: any) => {
	const { jenjang_id, penulis_user_id, editor_user_id, tanggal_lahir, ...skalarFields } = data;

	const updateData: any = { ...skalarFields };

	if (tanggal_lahir) updateData.tanggal_lahir = new Date(tanggal_lahir);
	if (jenjang_id) updateData.jenjang = { connect: { jenjang_id } };
	if (editor_user_id) updateData.editor = { connect: { user_id: editor_user_id } };

	return await db.kelulusan.update({
		where: { kelulusan_id },
		data: updateData,
		include: { jenjang: true, editor: true },
	});
};

// ── Hapus data kelulusan ──────────────────────────────────────
const hapusKelulusan = async (kelulusan_id: string) => {
	return await db.kelulusan.delete({ where: { kelulusan_id } });
};

export default {
	buatKelulusan,
	ambilSemuaKelulusan,
	ambilTahunAjaranTersedia,
	cekStatusLulus,
	cekKelulusanSiswa,
	editKelulusan,
	hapusKelulusan,
};
