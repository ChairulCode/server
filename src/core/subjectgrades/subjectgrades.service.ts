import db from "../../shared/config/db";
import { format } from "date-fns"; // Pastikan sudah install: npm install date-fns

/**
 * Membuat data nilai (rapor) baru (Admin)
 */
const buatSubjectGrade = async (data: any, user: any) => {
	const penulis_user_id = (user as any).userInfo?.user_id || user.user_id;

	return await db.subject_grades.create({
		data: {
			...data,
			penulis_user_id: penulis_user_id,
		},
	});
};

/**
 * Mengambil semua data nilai dengan filtering & pagination (Admin View)
 */
const ambilSemuaSubjectGrades = async (
	page: number,
	limit: number,
	jenjang_id?: string,
	search?: string
) => {
	try {
		const whereClause: any = {};

		if (jenjang_id) {
			whereClause.jenjang_id = jenjang_id;
		}

		if (search) {
			whereClause.OR = [
				{ tahun_ajaran: { contains: search, mode: "insensitive" } },
				{ semester: { contains: search, mode: "insensitive" } },
				{ nama_siswa: { contains: search, mode: "insensitive" } },
				{
					jenjang: {
						nama_jenjang: { contains: search, mode: "insensitive" },
					},
				},
			];
		}

		const [result, total] = await Promise.all([
			db.subject_grades.findMany({
				where: whereClause,
				take: limit,
				skip: (page - 1) * limit,
				orderBy: { created_at: "desc" },
				include: {
					jenjang: true,
					penulis: {
						select: { nama_lengkap: true },
					},
				},
			}),
			db.subject_grades.count({ where: whereClause }),
		]);

		return {
			metadata: {
				totalItems: total,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
				limit: limit,
			},
			data: result,
		};
	} catch (error) {
		console.error("Error di ambilSemuaSubjectGrades:", error);
		throw error;
	}
};

/**
 * Mengambil nilai spesifik milik siswa (Untuk Dashboard Siswa yang Login)
 */
const ambilNilaiSiswa = async (student_user_id: string) => {
	try {
		return await db.subject_grades.findMany({
			where: {
				student_user_id,
				status: "Published",
			},
			include: {
				jenjang: true,
				penulis: { select: { nama_lengkap: true } },
			},
			orderBy: { tahun_ajaran: "desc" },
		});
	} catch (error) {
		console.error("Error di ambilNilaiSiswa:", error);
		throw error;
	}
};

/**
 * Edit data nilai
 */
const editSubjectGrade = async (grade_id: string, data: any, user: any) => {
	try {
		const editor_user_id = (user as any).userInfo?.user_id || user.user_id;

		const {
			jenjang_id,
			student_user_id,
			penulis_user_id,
			editor_user_id: discard,
			jenjang,
			editor,
			created_at,
			updated_at,
			...skalarFields
		} = data;

		const updateData: any = { ...skalarFields };

		if (student_user_id) updateData.student_user_id = student_user_id;
		if (jenjang_id) updateData.jenjang = { connect: { jenjang_id } };
		if (editor_user_id) updateData.editor = { connect: { user_id: editor_user_id } };

		return await db.subject_grades.update({
			where: { grade_id },
			data: updateData,
			include: {
				jenjang: true,
				editor: { select: { nama_lengkap: true } },
			},
		});
	} catch (error) {
		console.error("Error di editSubjectGrade:", error);
		throw error;
	}
};

/**
 * Hapus data nilai
 */
const hapusSubjectGrade = async (grade_id: string) => {
	try {
		return await db.subject_grades.delete({
			where: { grade_id },
		});
	} catch (error) {
		console.error("Error di hapusSubjectGrade:", error);
		throw error;
	}
};

/**
 * Cek Nilai Publik
 * Input : NISN, Nama, Tanggal Lahir (YYYYMMDD), Kelas
 *
 * Fix 1: kelas di DB tersimpan dengan prefix tingkatan
 *        contoh: "SMA - 10 MIPA 1" atau "SMP - 9A"
 *        sedangkan input form public hanya "10 MIPA 1" atau "9A"
 *        → gunakan `contains` agar tetap match
 *
 * Fix 2: validasi nama case-insensitive + normalize whitespace
 *        agar "ani wijaya" bisa match dengan "Ani Wijaya" di DB
 */
const cekNilaiSiswaPublik = async (
	nisn: string,
	nama: string,
	tanggalLahirInput: string,
	kelas: string
) => {
	try {
		// ✅ Fix 1: contains agar "9A" match "SMP - 9A", "10 MIPA 1" match "SMA - 10 MIPA 1"
		const siswa = await db.siswa.findFirst({
			where: {
				nisn: nisn,
				kelas: { contains: kelas, mode: "insensitive" },
			},
		});

		if (!siswa) {
			throw new Error("Data siswa tidak ditemukan. Periksa kembali data yang dimasukkan.");
		}

		// ✅ Fix 2: normalize nama — lowercase + hapus spasi ganda
		// Agar "ani wijaya", "Ani Wijaya", "ANI WIJAYA" semua bisa match
		const normaNamaInput = nama.trim().toLowerCase().replace(/\s+/g, " ");
		const normaNamaDB = siswa.nama.trim().toLowerCase().replace(/\s+/g, " ");

		if (normaNamaDB !== normaNamaInput) {
			throw new Error("Data siswa tidak ditemukan. Periksa kembali data yang dimasukkan.");
		}

		// Validasi Tanggal Lahir (format YYYYMMDD)
		const tglLahirDB = format(new Date(siswa.tanggalLahir), "yyyyMMdd");
		if (tglLahirDB !== tanggalLahirInput) {
			throw new Error("Verifikasi gagal: Tanggal lahir tidak sesuai.");
		}

		// Ambil nilai dari subject_grades menggunakan siswa.id sebagai student_user_id
		const subjectGrades = await db.subject_grades.findMany({
			where: {
				student_user_id: siswa.id,
				status: "Published",
			},
			orderBy: { tahun_ajaran: "desc" },
		});

		// Flatten nilai_json → array per mata pelajaran
		// Format nilai_json di DB: { "Matematika": 85, "IPS": 90 }
		const daftarNilai = subjectGrades.flatMap((record) => {
			const nilaiJson = (record.nilai_json as Record<string, number>) ?? {};
			return Object.entries(nilaiJson).map(([mapel, nilai]) => ({
				id: `${record.grade_id}_${mapel}`,
				mataPelajaran: mapel,
				semester: record.semester,
				tahunAjaran: record.tahun_ajaran,
				nilaiAkhir: Number(nilai),
			}));
		});

		return {
			nama: siswa.nama,
			nisn: siswa.nisn,
			kelas: siswa.kelas,
			status: siswa.status,
			daftar_nilai: daftarNilai,
		};
	} catch (error) {
		console.error("Error di cekNilaiSiswaPublik:", error);
		throw error;
	}
};

export default {
	buatSubjectGrade,
	ambilSemuaSubjectGrades,
	ambilNilaiSiswa,
	editSubjectGrade,
	hapusSubjectGrade,
	cekNilaiSiswaPublik,
};
