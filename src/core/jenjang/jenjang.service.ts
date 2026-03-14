import db from "../../shared/config/db";

const ambilSemuaJenjang = async () => {
	try {
		const result = await db.jenjang.findMany();
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const ambilDetailJenjang = async (kegiatan_id: string) => {
	try {
		const result = await db.jenjang.findUnique({
			where: {
				jenjang_id: kegiatan_id,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

export default {
	ambilSemuaJenjang,
	ambilDetailJenjang,
};
