import { Request, Response, NextFunction } from "express";
import db from "../../config/db";

// Extend Express Request untuk include user dari JWT
interface AuthRequest extends Request {
	user?: {
		userInfo: {
			user_id: string;
			email: string;
			username: string;
			role: any; // Dibuat any karena bisa string atau objek { nama_role: string }
			login_terakhir: Date;
		};
	};
}

/**
 * Helper untuk menormalisasi role menjadi string lowercase
 */
const getNormalizedRole = (req: AuthRequest): string => {
	const roleData = req.user?.userInfo?.role;

	// Jika role berupa objek (seperti di log: { nama_role: "..." })
	if (roleData && typeof roleData === "object" && roleData.nama_role) {
		return roleData.nama_role.toLowerCase();
	}

	// Jika role langsung berupa string
	return String(roleData || "").toLowerCase();
};

/**
 * Middleware untuk check permission carousel berdasarkan role dan jenjang
 */
export const checkCarouselPermission = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const userRole = getNormalizedRole(req);
		const { carousel_id } = req.params;

		console.log("=== DEBUG PERMISSION MIDDLEWARE ===");
		console.log("Method:", req.method);
		console.log("Path:", req.path);
		console.log("Detected Role:", userRole);
		console.log("Body (before):", JSON.stringify(req.body, null, 2));

		if (!userRole) {
			return res.status(401).json({
				message: "Unauthorized: User information not found",
			});
		}

		/**
		 * SUPERADMIN: Full access ke semua carousel
		 */
		if (userRole.includes("super")) {
			console.log("✅ Status: Akses diberikan sebagai Super Administrator");
			return next();
		}

		/**
		 * UNTUK OPERASI CREATE (POST)
		 */
		if (req.method === "POST") {
			let { jenjang_id } = req.body;

			// Jika jenjang_id kosong, auto-assign berdasarkan role
			if (!jenjang_id) {
				const autoJenjangIds = await getJenjangIdsByRole(userRole);

				console.log("🔍 Auto-detect jenjang_id dari role:", {
					role: userRole,
					foundJenjangIds: autoJenjangIds,
				});

				if (autoJenjangIds.length > 0) {
					// Auto-assign jenjang_id pertama dari role user
					req.body.jenjang_id = autoJenjangIds[0];
					jenjang_id = autoJenjangIds[0];
					console.log(`✅ Auto-assign jenjang_id: ${jenjang_id} untuk role ${userRole}`);
				} else {
					// Admin tanpa jenjang tidak boleh create carousel global
					return res.status(403).json({
						message:
							"Forbidden: Hanya Superadmin yang bisa membuat carousel global (tanpa jenjang)",
					});
				}
			} else {
				// Jika jenjang_id sudah ada, validasi apakah user punya akses
				const hasAccess = await checkJenjangAccess(userRole, jenjang_id);

				console.log("🔍 Validasi akses ke jenjang_id:", {
					role: userRole,
					targetJenjangId: jenjang_id,
					hasAccess,
				});

				if (!hasAccess) {
					return res.status(403).json({
						message: `Forbidden: Anda tidak memiliki akses untuk carousel jenjang ini`,
					});
				}
			}

			console.log("✅ Permission CHECK PASSED untuk POST");
			console.log("Body (after):", JSON.stringify(req.body, null, 2));
			return next();
		}

		/**
		 * UNTUK OPERASI UPDATE/DELETE
		 */
		if (
			carousel_id &&
			(req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE")
		) {
			const carousel = await db.carousel.findUnique({
				where: { carousel_id },
				select: { jenjang_id: true },
			});

			if (!carousel) {
				return res.status(404).json({ message: "Carousel tidak ditemukan" });
			}

			// Carousel global (jenjang_id = null) hanya boleh diubah oleh superadmin
			if (!carousel.jenjang_id) {
				return res.status(403).json({
					message: "Forbidden: Hanya Superadmin yang bisa mengubah carousel global",
				});
			}

			// Check apakah user punya akses ke jenjang ini
			const hasAccess = await checkJenjangAccess(userRole, carousel.jenjang_id);

			console.log("🔍 Validasi akses UPDATE/DELETE:", {
				role: userRole,
				carouselJenjangId: carousel.jenjang_id,
				hasAccess,
			});

			if (!hasAccess) {
				return res.status(403).json({
					message: `Forbidden: Anda tidak memiliki akses untuk carousel jenjang ini`,
				});
			}

			console.log("✅ Permission CHECK PASSED untuk UPDATE/DELETE");
			return next();
		}

		// Untuk operasi lain (misal GET single), langsung next
		next();
	} catch (error) {
		console.error("❌ Error in checkCarouselPermission:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

/**
 * Helper function untuk check apakah role admin cocok dengan jenjang_id
 */
async function checkJenjangAccess(role: string, jenjang_id: string): Promise<boolean> {
	try {
		const jenjang = await db.jenjang.findUnique({
			where: { jenjang_id },
			select: { nama_jenjang: true },
		});

		if (!jenjang) return false;

		const namaJenjang = jenjang.nama_jenjang.toUpperCase();
		const roleUpper = role.toUpperCase();

		if (roleUpper.includes("SMA") && namaJenjang.includes("SMA")) return true;
		if (roleUpper.includes("SMP") && namaJenjang.includes("SMP")) return true;
		if (roleUpper.includes("SD") && !namaJenjang.includes("SMP") && namaJenjang.includes("SD"))
			return true;
		if (
			(roleUpper.includes("PGTK") || roleUpper.includes("TK")) &&
			(namaJenjang.includes("PGTK") || namaJenjang.includes("TK"))
		)
			return true;

		return false;
	} catch (error) {
		console.error("❌ Error in checkJenjangAccess:", error);
		return false;
	}
}

/**
 * Middleware untuk filter carousel berdasarkan role pada GET /carousels
 */
export const filterCarouselByRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const userRole = getNormalizedRole(req);

		if (!userRole) return next();

		console.log("=== FILTER CAROUSEL BY ROLE ===");
		console.log("Role:", userRole);

		// Superadmin melihat semuanya
		if (userRole.includes("super")) {
			console.log("✅ Superadmin - no filter applied");
			return next();
		}

		// Admin jenjang - filter by jenjang
		const jenjangIds = await getJenjangIdsByRole(userRole);
		console.log("🔍 Allowed jenjang IDs:", jenjangIds);

		if (jenjangIds.length > 0) {
			(req as any).allowedJenjangIds = jenjangIds;
			console.log("✅ Filter applied for admin jenjang");
		}

		next();
	} catch (error) {
		console.error("❌ Error in filterCarouselByRole:", error);
		next();
	}
};

/**
 * Helper function untuk get jenjang_ids berdasarkan role
 */
async function getJenjangIdsByRole(role: string): Promise<string[]> {
	try {
		const roleUpper = role.toUpperCase();
		const jenjangList = await db.jenjang.findMany({
			select: { jenjang_id: true, nama_jenjang: true },
		});

		const allowedJenjangIds: string[] = [];

		for (const jenjang of jenjangList) {
			const namaJenjang = jenjang.nama_jenjang.toUpperCase();

			if (roleUpper.includes("SMA") && namaJenjang.includes("SMA")) {
				allowedJenjangIds.push(jenjang.jenjang_id);
			} else if (roleUpper.includes("SMP") && namaJenjang.includes("SMP")) {
				allowedJenjangIds.push(jenjang.jenjang_id);
			} else if (
				roleUpper.includes("SD") &&
				!namaJenjang.includes("SMP") &&
				namaJenjang.includes("SD")
			) {
				allowedJenjangIds.push(jenjang.jenjang_id);
			} else if (
				(roleUpper.includes("PGTK") || roleUpper.includes("TK")) &&
				(namaJenjang.includes("PGTK") || namaJenjang.includes("TK"))
			) {
				allowedJenjangIds.push(jenjang.jenjang_id);
			}
		}

		return allowedJenjangIds;
	} catch (error) {
		console.error("❌ Error in getJenjangIdsByRole:", error);
		return [];
	}
}
