import { Request, Response } from "express";
import { PendaftaranService } from "./pendaftaran.service";

// ======================================
// CREATE PENDAFTARAN
// ======================================
export const buatPendaftaran = async (req: Request, res: Response) => {
	try {
		const files = req.files as { [fieldname: string]: Express.Multer.File[] };

		if (!files?.akteLahir?.[0] || !files?.kartuKeluarga?.[0] || !files?.buktiTransfer?.[0]) {
			return res.status(400).json({
				success: false,
				message: "Semua dokumen wajib diupload",
			});
		}

		const pendaftaranData = {
			...req.body,
			akteLahir: files.akteLahir[0].path,
			kartuKeluarga: files.kartuKeluarga[0].path,
			buktiTransfer: files.buktiTransfer[0].path,
		};

		const result = await PendaftaranService.createPendaftaran(pendaftaranData);

		return res.status(201).json({
			success: true,
			message: "Pendaftaran berhasil disimpan",
			data: result,
		});
	} catch (error: any) {
		console.error("Error pendaftaran:", error);
		return res.status(500).json({
			success: false,
			message: error.message || "Internal Server Error",
		});
	}
};

// ======================================
// GET ALL PENDAFTARAN
// ======================================
export const ambilSemuaPendaftaran = async (req: Request, res: Response) => {
	try {
		const { page, limit, status, kelas, search } = req.query;

		const result = await PendaftaranService.getAllPendaftaran({
			page: page ? parseInt(page as string) : undefined,
			limit: limit ? parseInt(limit as string) : undefined,
			status: status as string,
			kelas: kelas as string,
			search: search as string,
		});

		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ======================================
// GET PENDAFTARAN BY ID
// ======================================
export const ambilDetailPendaftaran = async (req: Request, res: Response) => {
	try {
		const { pendaftaran_id } = req.params;
		const data = await PendaftaranService.getPendaftaranById(pendaftaran_id);

		return res.status(200).json({
			success: true,
			data,
		});
	} catch (error: any) {
		return res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

// ======================================
// UPDATE STATUS PENDAFTARAN
// ======================================
export const updateStatusPendaftaran = async (req: Request, res: Response) => {
	try {
		const { pendaftaran_id } = req.params;
		const { status } = req.body;

		const validStatuses = ["pending", "approved", "rejected"];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: `Status harus salah satu dari: ${validStatuses.join(", ")}`,
			});
		}

		const result = await PendaftaranService.updateStatusPendaftaran(pendaftaran_id, { status });

		return res.status(200).json({
			success: true,
			message: "Status pendaftaran berhasil diperbarui",
			data: result,
		});
	} catch (error: any) {
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

// ======================================
// SEND EMAIL NOTIFICATION
// ======================================
export const kirimNotifikasiPendaftaran = async (req: Request, res: Response) => {
	try {
		const { pendaftaran_id } = req.params;

		const pendaftaran = await PendaftaranService.getPendaftaranById(pendaftaran_id);

		if (!pendaftaran.emailOrangtua) {
			return res.status(400).json({
				success: false,
				message: "Email orang tua tidak tersedia untuk pendaftaran ini",
			});
		}

		if (!pendaftaran.statusPendaftaran) {
			return res.status(400).json({
				success: false,
				message: "Status pendaftaran tidak ditemukan",
			});
		}

		await PendaftaranService.sendNotification(pendaftaran_id);

		return res.status(200).json({
			success: true,
			message: `Email notifikasi berhasil dikirim ke ${pendaftaran.emailOrangtua}`,
			data: {
				emailSent: true,
				recipient: pendaftaran.emailOrangtua,
				status: pendaftaran.statusPendaftaran,
				registrationNumber: pendaftaran.noPendaftaran,
				studentName: pendaftaran.namaSiswa,
				timestamp: new Date().toISOString(),
			},
		});
	} catch (error: any) {
		const statusCode = error.message.includes("tidak ditemukan") ? 404 : 400;
		return res.status(statusCode).json({
			success: false,
			message: error.message || "Gagal mengirim email notifikasi",
		});
	}
};

// ======================================
// DELETE PENDAFTARAN
// ======================================
export const hapusPendaftaran = async (req: Request, res: Response) => {
	try {
		const { pendaftaran_id } = req.params;

		await PendaftaranService.deletePendaftaran(pendaftaran_id);

		return res.status(200).json({
			success: true,
			message: "Data pendaftaran berhasil dihapus",
		});
	} catch (error: any) {
		return res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

// ======================================
// ✅ GET STATISTICS — filter per role dari JWT
// ======================================
export const ambilStatistikPendaftaran = async (req: Request, res: Response) => {
	try {
		// ✅ JWT payload struktur: { userInfo: { role: "Kepala Sekolah SD", ... } }
		// Sesuai auth.service.ts — jwt.sign({ userInfo: { role: user.role.nama_role } })
		const role = (req as any).user?.userInfo?.role;

		const data = await PendaftaranService.getStatistics(role);

		return res.status(200).json({
			success: true,
			data,
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
