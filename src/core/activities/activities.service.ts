import db from "../../shared/config/db";
import { KegiatanInput } from "../../shared/types/prisma";

const buatKegiatan = async (data: any) => {
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

		const result = await db.kegiatan.create({
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

const ambilSemuaKegiatan = async (page: number, limit: number) => {
	try {
		const [result, total] = await Promise.all([
			db.kegiatan.findMany({
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
			db.kegiatan.count(),
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

const ambilDetailKegiatan = async (kegiatan_id: string) => {
	try {
		const result = await db.kegiatan.findUnique({
			where: {
				kegiatan_id,
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

const editKegiatanLengkap = async (kegiatan_id: string, data: any) => {
	try {
		console.log(data);
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

		await db.kegiatan_jenjang.deleteMany({
			where: {
				kegiatan_id: kegiatan_id,
			},
		});

		await db.kegiatan.update({
			where: { kegiatan_id },
			data: updateData,
		});

		if (jenjang_ids && jenjang_ids.length > 0) {
			const relasiBaru = jenjang_ids.map((id: string) => ({
				kegiatan_id: kegiatan_id,
				jenjang_id: id,
			}));

			await db.kegiatan_jenjang.createMany({
				data: relasiBaru,
				skipDuplicates: true,
			});
		}

		const finalResult = await db.kegiatan.findUnique({
			where: { kegiatan_id },
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

const editKegiatanSebagian = async (kegiatan_id: string, data: Partial<KegiatanInput>) => {
	try {
		const { jenjang_ids, ...updateData } = data;

		const result = await db.kegiatan.update({
			where: {
				kegiatan_id,
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

const hapusKegiatan = async (kegiatan_id: string) => {
	try {
		const result = await db.kegiatan.delete({
			where: {
				kegiatan_id,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

export default {
	buatKegiatan,
	ambilSemuaKegiatan,
	ambilDetailKegiatan,
	editKegiatanLengkap,
	editKegiatanSebagian,
	hapusKegiatan,
};
