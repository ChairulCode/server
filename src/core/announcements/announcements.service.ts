import db from "../../shared/config/db";
import { PengumumanInput } from "../../shared/types/prisma";

const buatPengumuman = async (data: any) => {
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

		const result = await db.pengumuman.create({
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

const ambilSemuaPengumuman = async (page: number, limit: number) => {
	try {
		const [result, total] = await Promise.all([
			db.pengumuman.findMany({
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
			db.pengumuman.count(),
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

const ambilDetailPengumuman = async (pengumuman_id: string) => {
	try {
		const result = await db.pengumuman.findUnique({
			where: {
				pengumuman_id,
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

const editPengumumanLengkap = async (pengumuman_id: string, data: any) => {
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

		await db.pengumuman_jenjang.deleteMany({
			where: {
				pengumuman_id: pengumuman_id,
			},
		});

		await db.pengumuman.update({
			where: { pengumuman_id },
			data: updateData,
		});

		if (jenjang_ids && jenjang_ids.length > 0) {
			const relasiBaru = jenjang_ids.map((id: string) => ({
				pengumuman_id: pengumuman_id,
				jenjang_id: id,
			}));

			await db.pengumuman_jenjang.createMany({
				data: relasiBaru,
				skipDuplicates: true,
			});
		}

		const finalResult = await db.pengumuman.findUnique({
			where: { pengumuman_id },
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

const editPengumumanSebagian = async (pengumuman_id: string, data: Partial<PengumumanInput>) => {
	try {
		const { jenjang_ids, ...updateData } = data;

		const result = await db.pengumuman.update({
			where: {
				pengumuman_id,
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

const hapusPengumuman = async (pengumuman_id: string) => {
	try {
		const result = await db.pengumuman.delete({
			where: {
				pengumuman_id,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

export default {
	buatPengumuman,
	ambilSemuaPengumuman,
	ambilDetailPengumuman,
	editPengumumanLengkap,
	editPengumumanSebagian,
	hapusPengumuman,
};
