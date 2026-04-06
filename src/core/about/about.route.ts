import express from "express";
import {
	buatAbout,
	ambilDetailAbout,
	ambilSemuaAbout,
	editAboutLengkap,
	editAboutSebagian,
	ambilAboutPublik,
	hapusAbout,
} from "./about.controller";
import {
	validasiAmbilDetailAbout,
	validasiBuatAbout,
	validasiEditAbout,
	validasiHapusAbout,
} from "./about.validator";
import authenticateJWT from "../../shared/middlewares/jwtVerification";
import {
	checkAboutPermission,
	filterAboutByRole,
} from "../../shared/middlewares/about/permission.middleware";

const router = express.Router();

/**
 * GET /api/v1/about/publik?jenjang=SMA
 * Public route - ambil about berdasarkan jenjang
 */
router.get("/publik", ambilAboutPublik);

/**
 * GET /api/v1/about/:about_id
 * Public route - detail about
 */
router.get("/:about_id", validasiAmbilDetailAbout, ambilDetailAbout);

/**
 * GET /api/v1/about
 * Protected - list about filtered by role
 */
router.get(
	"/",
	(req, res, next) => {
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer ")) {
			return authenticateJWT(req, res, (err) => {
				if (err) return next();
				filterAboutByRole(req, res, next);
			});
		}
		next();
	},
	ambilSemuaAbout
);

/**
 * POST /api/v1/about
 * Protected - Hanya admin sesuai jenjang atau superadmin
 */
router.post("/", authenticateJWT, checkAboutPermission, validasiBuatAbout, buatAbout);

/**
 * PUT /api/v1/about/:about_id
 * Protected - Hanya admin sesuai jenjang atau superadmin
 */
router.put(
	"/:about_id",
	authenticateJWT,
	checkAboutPermission,
	validasiEditAbout,
	editAboutLengkap
);

/**
 * PATCH /api/v1/about/:about_id
 * Protected - Hanya admin sesuai jenjang atau superadmin
 */
router.patch(
	"/:about_id",
	authenticateJWT,
	checkAboutPermission,
	validasiEditAbout,
	editAboutSebagian
);

/**
 * DELETE /api/v1/about/:about_id
 * Protected - Hanya admin sesuai jenjang atau superadmin
 */
router.delete("/:about_id", authenticateJWT, checkAboutPermission, validasiHapusAbout, hapusAbout);

export default router;
