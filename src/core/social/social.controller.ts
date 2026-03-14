import { Request, Response } from "express";
import { SocialService } from "./social.service";

// ======================================
// CREATE
// ======================================
export const buatSocialMedia = async (req: Request, res: Response) => {
	try {
		const result = await SocialService.createSocialMedia({
			...req.body,
			penulis_user_id: req.user.userInfo.user_id, // ✅ FIX
		});

		return res.status(201).json({
			message: "Social media berhasil ditambahkan",
			data: result,
		});
	} catch (error: any) {
		return res.status(400).json({
			message: error.message,
		});
	}
};

// ======================================
// GET ALL
// ======================================
export const ambilSemuaSocialMedia = async (_req: Request, res: Response) => {
	try {
		const data = await SocialService.getAllSocialMedia();

		return res.status(200).json({ data });
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

// ======================================
// GET BY ID
// ======================================
export const ambilDetailSocialMedia = async (req: Request, res: Response) => {
	try {
		const { social_media_id } = req.params;

		const data = await SocialService.getSocialMediaById(social_media_id);

		return res.status(200).json({ data });
	} catch (error: any) {
		return res.status(404).json({
			message: error.message,
		});
	}
};

// ======================================
// UPDATE (PUT / PATCH)
// ======================================
export const editSocialMedia = async (req: Request, res: Response) => {
	try {
		const { social_media_id } = req.params;

		const result = await SocialService.updateSocialMedia(social_media_id, {
			...req.body,
			editor_user_id: req.user.userInfo.user_id, // ✅ FIX
		});

		return res.status(200).json({
			message: "Social media berhasil diperbarui",
			data: result,
		});
	} catch (error: any) {
		return res.status(400).json({
			message: error.message,
		});
	}
};

// ======================================
// DELETE
// ======================================
export const hapusSocialMedia = async (req: Request, res: Response) => {
	try {
		const { social_media_id } = req.params;

		await SocialService.deleteSocialMedia(social_media_id);

		return res.status(200).json({
			message: "Social media berhasil dihapus",
		});
	} catch (error: any) {
		return res.status(404).json({
			message: error.message,
		});
	}
};

// ======================================
// TOGGLE ACTIVE
// ======================================
export const toggleActiveSocial = async (req: Request, res: Response) => {
	try {
		const { social_media_id } = req.params;

		const result = await SocialService.toggleActive(
			social_media_id,
			req.user.userInfo.user_id // ✅ FIX
		);

		return res.status(200).json({
			message: "Status social media berhasil diubah",
			data: result,
		});
	} catch (error: any) {
		return res.status(400).json({
			message: error.message,
		});
	}
};
