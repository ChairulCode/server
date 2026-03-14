import { PrismaClient, SocialMediaPlatform } from "@prisma/client";

const prisma = new PrismaClient();

export class SocialService {
	// =====================================================
	// CREATE SOCIAL MEDIA
	// =====================================================
	static async createSocialMedia(data: {
		level: any; // "SMA" | "SMP" | "SD" | "PGTK"
		platform: SocialMediaPlatform;
		username: string;
		url: string;
		followers?: string;
		urutan?: number;
		penulis_user_id: string;
	}) {
		// 1. Max 4 social media aktif PER LEVEL
		const activeCount = await prisma.social_media.count({
			where: {
				level: data.level, // Tambahkan filter level
				is_active: true,
			},
		});

		if (activeCount >= 4) {
			throw new Error(`Maksimal hanya 4 social media aktif untuk jenjang ${data.level}`);
		}

		// 2. Platform tidak boleh duplikat DALAM LEVEL YANG SAMA
		const platformExist = await prisma.social_media.findFirst({
			where: {
				platform: data.platform,
				level: data.level, // Tambahkan filter level
			},
		});

		if (platformExist) {
			throw new Error(`Platform ${data.platform} sudah terdaftar untuk jenjang ${data.level}`);
		}

		// 3. Urutan unik (Opsional: Jika urutan ingin per jenjang, tambahkan filter level)
		if (data.urutan !== undefined) {
			const orderExist = await prisma.social_media.findFirst({
				where: {
					urutan: data.urutan,
					level: data.level, // Filter per level agar urutan 1-4 tersedia di tiap jenjang
				},
			});

			if (orderExist) {
				throw new Error("Urutan social media sudah digunakan di jenjang ini");
			}
		}

		// 4. Simpan data
		return prisma.social_media.create({
			data: {
				platform: data.platform,
				username: data.username,
				url: data.url,
				followers: data.followers,
				urutan: data.urutan,
				penulis_user_id: data.penulis_user_id,
				level: data.level,
			},
		});
	}

	// =====================================================
	// UPDATE SOCIAL MEDIA
	// =====================================================
	static async updateSocialMedia(
		id: string,
		data: {
			platform?: SocialMediaPlatform;
			level?: any;
			username?: string;
			url?: string;
			followers?: string;
			urutan?: number;
			is_active?: boolean;
			editor_user_id: string;
		}
	) {
		const currentData = await this.getSocialMediaById(id);
		const targetLevel = data.level || currentData.level;

		// Cek platform jika diubah atau level diubah
		if (data.platform || data.level) {
			const platformExist = await prisma.social_media.findFirst({
				where: {
					platform: data.platform || currentData.platform,
					level: targetLevel,
					NOT: { social_media_id: id },
				},
			});

			if (platformExist) {
				throw new Error(`Platform sudah digunakan di jenjang ${targetLevel}`);
			}
		}

		// Cek urutan jika diubah
		if (data.urutan !== undefined) {
			const orderExist = await prisma.social_media.findFirst({
				where: {
					urutan: data.urutan,
					level: targetLevel,
					NOT: { social_media_id: id },
				},
			});

			if (orderExist) {
				throw new Error("Urutan sudah digunakan di jenjang ini");
			}
		}

		return prisma.social_media.update({
			where: { social_media_id: id },
			data: {
				...data,
			},
		});
	}

	// Fungsi lainnya (getAllSocialMedia, delete, dll) tetap sama
	static async getAllSocialMedia() {
		return prisma.social_media.findMany({
			orderBy: [{ level: "asc" }, { urutan: "asc" }], // Urutkan per level dulu baru urutan angka
			include: {
				penulis: { select: { user_id: true, nama_lengkap: true } },
				editor: { select: { user_id: true, nama_lengkap: true } },
			},
		});
	}

	static async getSocialMediaById(id: string) {
		const social = await prisma.social_media.findUnique({
			where: { social_media_id: id },
		});
		if (!social) throw new Error("Social media tidak ditemukan");
		return social;
	}

	static async deleteSocialMedia(id: string) {
		await this.getSocialMediaById(id);
		return prisma.social_media.delete({ where: { social_media_id: id } });
	}

	static async toggleActive(id: string, editor_user_id: string) {
		const social = await this.getSocialMediaById(id);
		return prisma.social_media.update({
			where: { social_media_id: id },
			data: { is_active: !social.is_active, editor_user_id },
		});
	}
}
