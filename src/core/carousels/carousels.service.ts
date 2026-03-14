import db from "../../shared/config/db";

interface CarouselInput {
	judul: string;
	urutan: number;
	konten: string;
	path_gambar: string;
	tanggal_publikasi: Date;
	is_published?: boolean;
	is_featured?: boolean;

	jenjang_id: string | null;

	penulis_user_id: string;
	editor_user_id: string | null;
}

const buatCarousel = async (data: CarouselInput) => {
	try {
		const result = await db.carousel.create({
			data: {
				...data,
			},
			include: {
				jenjang: true,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const ambilSemuaCarousel = async (page: number, limit: number) => {
	try {
		const pageNum = parseInt(page as any);
		const limitNum = parseInt(limit as any);

		const [result, total] = await Promise.all([
			db.carousel.findMany({
				take: limitNum,
				skip: (pageNum - 1) * limitNum,
				orderBy: { urutan: "asc" },
				include: {
					jenjang: true,
					penulis: true,
					editor: true,
				},
			}),
			db.carousel.count(),
		]);

		const totalPages = Math.ceil(total / limitNum);

		return {
			metadata: {
				totalItems: total,
				totalPages: totalPages,
				currentPage: pageNum,
				limit: limitNum,
			},
			data: result,
		};
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const ambilDetailCarousel = async (carousel_id: string) => {
	try {
		const result = await db.carousel.findUnique({
			where: {
				carousel_id,
			},
			include: {
				jenjang: true,
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

const editCarouselLengkap = async (carousel_id: string, data: CarouselInput) => {
	try {
		const result = await db.carousel.update({
			where: { carousel_id },
			data: data,
			include: {
				jenjang: true,
			},
		});

		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const editCarouselSebagian = async (carousel_id: string, data: Partial<CarouselInput>) => {
	try {
		const result = await db.carousel.update({
			where: {
				carousel_id,
			},
			data: data,
			include: {
				jenjang: true,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

const hapusCarousel = async (carousel_id: string) => {
	try {
		const result = await db.carousel.delete({
			where: {
				carousel_id,
			},
		});
		return result;
	} catch (error) {
		console.error("Terjadi kesalahan di sisi server!", error);
		throw error;
	}
};

export default {
	buatCarousel,
	ambilSemuaCarousel,
	ambilDetailCarousel,
	editCarouselLengkap,
	editCarouselSebagian,
	hapusCarousel,
};
