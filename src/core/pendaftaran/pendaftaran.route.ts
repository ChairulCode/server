import express from "express";
import multer from "multer";
import {
	buatPendaftaran,
	ambilSemuaPendaftaran,
	ambilDetailPendaftaran,
	updateStatusPendaftaran,
	hapusPendaftaran,
	ambilStatistikPendaftaran,
	kirimNotifikasiPendaftaran,
} from "./pendaftaran.controller";
import {
	validasiUpdateStatus,
	validasiQueryPendaftaran,
	validasiAmbilDetailPendaftaran,
	validasiHapusPendaftaran,
} from "./pendaftaran.validator";

import { uploadPendaftaran } from "../../shared/middlewares/uploadMiddleware";
import authenticateJWT from "../../shared/middlewares/jwtVerification";

const router = express.Router();

/**
 * ============================================================
 * ⚠️ ROUTE ORDER MATTERS!
 * Specific routes MUST come before dynamic routes
 * ============================================================
 */

/**
 * ============================================================
 * 1. ADMIN ROUTES - SPECIFIC PATHS
 * ============================================================
 */

/* GET: Statistik Pendaftaran - endpoint lama (tetap dipertahankan) */
router.get("/statistics", authenticateJWT, ambilStatistikPendaftaran);

/* ✅ GET: Statistik Pendaftaran - endpoint baru (sesuai frontend) */
router.get("/statistik", authenticateJWT, ambilStatistikPendaftaran);

/* POST: Kirim Email Notifikasi */
router.post("/send-notif/:pendaftaran_id", authenticateJWT, kirimNotifikasiPendaftaran);

/* GET: Ambil Semua Daftar Pendaftar */
router.get("/", authenticateJWT, validasiQueryPendaftaran, ambilSemuaPendaftaran);

/**
 * ============================================================
 * 2. PUBLIC ROUTES
 * ============================================================
 */

/* POST: Kirim Pendaftaran Baru */
router.post(
	"/",
	(req, res, next) => {
		uploadPendaftaran.fields([
			{ name: "akteLahir", maxCount: 1 },
			{ name: "kartuKeluarga", maxCount: 1 },
			{ name: "buktiTransfer", maxCount: 1 },
		])(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				return res.status(400).json({
					success: false,
					message: `Upload Error: ${err.message}`,
				});
			} else if (err) {
				return res.status(400).json({
					success: false,
					message: err.message,
				});
			}
			next();
		});
	},
	buatPendaftaran
);

/**
 * ============================================================
 * 3. DYNAMIC ROUTES (Must be LAST!)
 * ============================================================
 */

/* GET: Detail Pendaftaran */
router.get("/:pendaftaran_id", validasiAmbilDetailPendaftaran, ambilDetailPendaftaran);

/* PATCH: Update Status */
router.patch(
	"/:pendaftaran_id/status",
	authenticateJWT,
	validasiUpdateStatus,
	updateStatusPendaftaran
);

/* DELETE: Hapus Data Pendaftaran */
router.delete("/:pendaftaran_id", authenticateJWT, validasiHapusPendaftaran, hapusPendaftaran);

export default router;
