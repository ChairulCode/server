import { Request, Response } from "express";
import subjectGradesService from "./subjectgrades.service";

/**
 * Membuat data nilai baru
 */
export const buatSubjectGrade = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;
		const userId = user?.userInfo?.user_id || user?.user_id;

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: "User ID tidak ditemukan dalam token.",
			});
		}

		// Sisipkan ke body agar service bisa membacanya
		req.body.penulis_user_id = userId;

		const result = await subjectGradesService.buatSubjectGrade(req.body, user);

		res.status(201).json({
			success: true,
			message: "Data nilai berhasil dibuat",
			data: result,
		});
	} catch (error: any) {
		console.error("Create Error:", error);
		res.status(500).json({
			success: false,
			message: "Gagal membuat data nilai",
			serverMessage: error.message,
		});
	}
};

/**
 * Mengambil semua data nilai (Admin View)
 */
export const ambilSemuaSubjectGrades = async (req: Request, res: Response) => {
	const { page = "1", limit = "20", jenjang_id, search } = req.query;
	try {
		const result = await subjectGradesService.ambilSemuaSubjectGrades(
			Number(page),
			Number(limit),
			jenjang_id as string,
			search as string
		);
		res.status(200).json({
			success: true,
			message: "Data nilai berhasil diambil",
			...result,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			serverMessage: error.message,
		});
	}
};

/**
 * Mengambil nilai milik siswa yang sedang login (Student View)
 */
export const ambilNilaiSiswa = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;
		const studentId = user?.userInfo?.user_id || user?.user_id;

		if (!studentId) {
			return res.status(401).json({ success: false, message: "Siswa tidak terautentikasi." });
		}

		const result = await subjectGradesService.ambilNilaiSiswa(studentId);

		res.status(200).json({
			success: true,
			message: "Data nilai siswa berhasil diambil",
			data: result,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			serverMessage: error.message,
		});
	}
};

/**
 * Mengupdate data nilai
 */
export const editSubjectGrade = async (req: Request, res: Response) => {
	const { grade_id } = req.params;
	try {
		const user = (req as any).user;
		const userId = user?.userInfo?.user_id || user?.user_id;

		// Sisipkan ID penyunting ke body
		req.body.editor_user_id = userId;

		const result = await subjectGradesService.editSubjectGrade(grade_id, req.body, user);

		res.status(200).json({
			success: true,
			message: `Data nilai berhasil diupdate`,
			data: result,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Gagal mengupdate data",
			serverMessage: error.message,
		});
	}
};

/**
 * Menghapus data nilai
 */
export const hapusSubjectGrade = async (req: Request, res: Response) => {
	const { grade_id } = req.params;
	try {
		const result = await subjectGradesService.hapusSubjectGrade(grade_id);
		res.status(200).json({
			success: true,
			message: `Data nilai berhasil dihapus`,
			data: result,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			serverMessage: error.message,
		});
	}
};
// Tambahkan handleCekNilaiSiswaPublik ke dalam export
export const handleCekNilaiSiswaPublik = async (req: Request, res: Response) => {
	try {
		const { nisn, nama, tanggal_lahir, kelas } = req.body;

		const result = await subjectGradesService.cekNilaiSiswaPublik(nisn, nama, tanggal_lahir, kelas);

		res.status(200).json({
			success: true,
			message: "Data nilai berhasil ditemukan",
			data: result,
		});
	} catch (error: any) {
		res.status(404).json({
			success: false,
			message: error.message || "Gagal mengambil data nilai",
		});
	}
};
