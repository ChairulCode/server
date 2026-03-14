import db from "../../shared/config/db";
import { PrestasiInput } from "../../shared/types/prisma";

const buatPrestasi = async (data: any) => {
	try {
		const jenjang_ids = data.jenjang.map((j: any) => j.jenjang_id);
		const { jenjang, penulis_user_id, editor_user_id, ...skalarFields } = data;

		const jenjangRelasiInput =
			jenjang_ids?.length > 0
				? {
						create: jenjang_ids.map((id: string) => ({
							jenjang: { connect: { jenjang_id: id } },
						})),
					}
				: undefined;

		const penulisInput = penulis_user_id
			? { penulis: { connect: { user_id: penulis_user_id } } }
			: {};

		const editorInput = editor_user_id ? { editor: { connect: { user_id: editor_user_id } } } : {};

		const result = await db.prestasi.create({
			data: {
				...skalarFields,
				...penulisInput,
				...editorInput,
				jenjang_relasi: jenjangRelasiInput,
			},
			include: {
				jenjang_relasi: {
					include: {
						jenjang: true,
					},
				},
				penulis: true, // Sertakan penulis jika perlu
				editor: true, // Sertakan editor jika perlu
			},
		});

		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const ambilSemuaPrestasi = async (page: number, limit: number) => {
	try {
		const [result, total] = await Promise.all([
			db.prestasi.findMany({
				take: limit,
				skip: (page - 1) * limit,
				orderBy: { tanggal_publikasi: "desc" },
				include: {
					jenjang_relasi: {
						include: {
							jenjang: true,
						},
					},
				},
			}),
			db.prestasi.count(),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			metadata: {
				totalItems: total,
				totalPages: totalPages,
				currentPage: page,
				limit: limit,
			},
			data: result,
		};
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const ambilDetailPrestasi = async (prestasi_id: string) => {
	try {
		const result = await db.prestasi.findUnique({
			where: {
				prestasi_id,
			},
			include: {
				jenjang_relasi: {
					include: {
						jenjang: true,
					},
				},
				penulis: true,
				editor: true,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const editPrestasiLengkap = async (prestasi_id: string, data: any) => {
	try {
		const jenjang_ids = data.jenjang_relasi.map((j: any) => j.jenjang_id);

		const { jenjang, penulis_user_id, editor_user_id, jenjang_relasi, ...skalarFields } = data;
		const updateData: any = { ...skalarFields };

		if (penulis_user_id) {
			updateData.penulis = {
				connect: {
					user_id: penulis_user_id,
				},
			};
		}

		if (editor_user_id) {
			updateData.editor = {
				connect: {
					user_id: editor_user_id,
				},
			};
		}

		await db.prestasi_jenjang.deleteMany({
			where: {
				prestasi_id: prestasi_id,
			},
		});

		await db.prestasi.update({
			where: { prestasi_id },
			data: updateData,
		});

		if (jenjang_ids && jenjang_ids.length > 0) {
			const relasiBaru = jenjang_ids.map((id: string) => ({
				prestasi_id: prestasi_id,
				jenjang_id: id,
			}));

			await db.prestasi_jenjang.createMany({
				data: relasiBaru,
				skipDuplicates: true,
			});
		}

		const finalResult = await db.prestasi.findUnique({
			where: { prestasi_id },
			include: {
				jenjang_relasi: {
					include: {
						jenjang: true,
					},
				},
			},
		});

		return finalResult;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const editPrestasiSebagian = async (prestasi_id: string, data: Partial<PrestasiInput>) => {
	try {
		const { jenjang_ids, ...updateData } = data;

		const result = await db.prestasi.update({
			where: {
				prestasi_id,
			},
			data: updateData,
			include: {
				jenjang_relasi: true,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const hapusPrestasi = async (prestasi_id: string) => {
	try {
		const result = await db.prestasi.delete({
			where: {
				prestasi_id,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

export default {
	buatPrestasi,
	ambilSemuaPrestasi,
	ambilDetailPrestasi,
	editPrestasiLengkap,
	editPrestasiSebagian,
	hapusPrestasi,
};
