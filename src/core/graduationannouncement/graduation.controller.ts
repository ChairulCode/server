import { Request, Response } from "express";
import graduationService from "./graduation.service";

// ── Buat kelulusan ────────────────────────────────────────────
export const buatKelulusan = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;
		const userId = user?.userInfo?.user_id ?? user?.user_id;

		if (!userId)
			return res.status(401).json({
				success: false,
				message: "User ID tidak ditemukan dalam token.",
			});

		req.body.penulis_user_id = userId;

		const result = await graduationService.buatKelulusan(req.body, user);
		return res.status(201).json({
			success: true,
			message: "Data kelulusan berhasil dibuat.",
			data: result,
		});
	} catch (err: any) {
		console.error("buatKelulusan error:", err);
		return res.status(500).json({
			success: false,
			message: "Gagal membuat data kelulusan.",
			serverMessage: err.message,
		});
	}
};

// ── Ambil semua kelulusan ─────────────────────────────────────
export const ambilSemuaKelulusan = async (req: Request, res: Response) => {
	const { page = "1", limit = "20", jenjang_id, search } = req.query;
	try {
		const result = await graduationService.ambilSemuaKelulusan(
			Number(page),
			Number(limit),
			jenjang_id as string,
			search as string
		);
		return res.status(200).json({
			message: "Data kelulusan berhasil diambil.",
			...result,
		});
	} catch (err) {
		return res.status(500).json({ message: "Server Error", serverMessage: err });
	}
};

// ── Ambil daftar tahun ajaran yang tersedia (publik) ──────────
export const ambilTahunAjaranController = async (req: Request, res: Response) => {
	try {
		const data = await graduationService.ambilTahunAjaranTersedia();
		return res.status(200).json({
			success: true,
			message: "Daftar tahun ajaran berhasil diambil.",
			data,
		});
	} catch (err: any) {
		return res.status(500).json({
			success: false,
			message: err.message ?? "Server Error",
		});
	}
};

// ── Cek status lulus (endpoint lama) ─────────────────────────
export const cekStatusLulus = async (req: Request, res: Response) => {
	const { nomor_siswa } = req.params;
	try {
		const result = await graduationService.cekStatusLulus(nomor_siswa);

		if (!result)
			return res.status(404).json({
				message: "Data kelulusan tidak ditemukan. Pastikan nomor ujian benar.",
				data: null,
			});

		return res.status(200).json({
			message: "Data kelulusan ditemukan.",
			data: result,
		});
	} catch (err) {
		return res.status(500).json({ message: "Server Error", serverMessage: err });
	}
};

// ── Cek kelulusan siswa (nomor_siswa + tanggal_lahir) ─────────
// tahun_ajaran sekarang OPSIONAL — jika tidak dikirim, sistem otomatis
// mencari data paling baru milik siswa tersebut.
export const cekKelulusanSiswaController = async (req: Request, res: Response) => {
	try {
		const { nomor_siswa, tanggal_lahir, tahun_ajaran } = req.body;

		const result = await graduationService.cekKelulusanSiswa(
			nomor_siswa,
			tanggal_lahir,
			tahun_ajaran // bisa undefined/kosong
		);

		if (!result.found) {
			return res.status(404).json({
				success: false,
				message: "Data tidak ditemukan. Pastikan Nomor Induk dan tanggal lahir sudah benar.",
			});
		}

		if (!result.aksesValid) {
			return res.status(403).json({
				success: false,
				message: "Pengumuman kelulusan belum dapat diakses.",
				tanggal_akses: result.tanggal_akses,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Data kelulusan ditemukan.",
			data: result.data,
		});
	} catch (err: any) {
		return res.status(500).json({
			success: false,
			message: err.message ?? "Server Error",
		});
	}
};

// ── Edit kelulusan ────────────────────────────────────────────
export const editKelulusan = async (req: Request, res: Response) => {
	const { kelulusan_id } = req.params;
	try {
		const user = (req as any).user;
		const userId = user?.userInfo?.user_id ?? user?.user_id;
		req.body.editor_user_id = userId;

		const result = await graduationService.editKelulusan(kelulusan_id, req.body);
		return res.status(200).json({
			success: true,
			message: "Data kelulusan berhasil diupdate.",
			data: result,
		});
	} catch (err: any) {
		return res.status(500).json({
			success: false,
			message: "Gagal mengupdate data.",
			serverMessage: err.message,
		});
	}
};

// ── Hapus kelulusan ───────────────────────────────────────────
export const hapusKelulusan = async (req: Request, res: Response) => {
	const { kelulusan_id } = req.params;
	try {
		await graduationService.hapusKelulusan(kelulusan_id);
		return res.status(200).json({
			message: `Data kelulusan berhasil dihapus.`,
		});
	} catch (err) {
		return res.status(500).json({ message: "Server Error", serverMessage: err });
	}
};
