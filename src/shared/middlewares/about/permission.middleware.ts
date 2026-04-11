import { Request, Response, NextFunction } from "express";
import db from "../../config/db";

interface AuthRequest extends Request {
	user?: {
		userInfo: {
			user_id: string;
			email: string;
			username: string;
			role: any;
			login_terakhir: Date;
		};
	};
}

const getNormalizedRole = (req: AuthRequest): string => {
	const roleData = req.user?.userInfo?.role;

	if (roleData && typeof roleData === "object" && roleData.nama_role) {
		return roleData.nama_role.toLowerCase();
	}

	return String(roleData || "").toLowerCase();
};

export const checkAboutPermission = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const userRole = getNormalizedRole(req);
		const { about_id } = req.params;

		console.log("=== DEBUG ABOUT PERMISSION MIDDLEWARE ===");
		console.log("Method:", req.method);
		console.log("Detected Role:", userRole);

		if (!userRole) {
			return res.status(401).json({
				message: "Unauthorized: User information not found",
			});
		}

		if (userRole.includes("super")) {
			console.log("✅ Status: Akses diberikan sebagai Super Administrator");
			return next();
		}

		// CREATE
		if (req.method === "POST") {
			let { jenjang_id } = req.body;

			if (!jenjang_id) {
				const autoJenjangIds = await getJenjangIdsByRole(userRole);

				if (autoJenjangIds.length > 0) {
					req.body.jenjang_id = autoJenjangIds[0];
					jenjang_id = autoJenjangIds[0];
					console.log(`✅ Auto-assign jenjang_id: ${jenjang_id} untuk role ${userRole}`);
				} else {
					return res.status(403).json({
						message: "Forbidden: Hanya Superadmin yang bisa membuat about global",
					});
				}
			} else {
				const hasAccess = await checkJenjangAccess(userRole, jenjang_id);

				if (!hasAccess) {
					return res.status(403).json({
						message: `Forbidden: Anda tidak memiliki akses untuk about jenjang ini`,
					});
				}
			}

			return next();
		}

		// UPDATE/DELETE
		if (about_id && (req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE")) {
			const about = await db.about.findUnique({
				where: { about_id },
				select: { jenjang_id: true },
			});

			if (!about) {
				return res.status(404).json({ message: "About tidak ditemukan" });
			}

			if (!about.jenjang_id) {
				return res.status(403).json({
					message: "Forbidden: Hanya Superadmin yang bisa mengubah about global",
				});
			}

			const hasAccess = await checkJenjangAccess(userRole, about.jenjang_id);

			if (!hasAccess) {
				return res.status(403).json({
					message: `Forbidden: Anda tidak memiliki akses untuk about jenjang ini`,
				});
			}

			return next();
		}

		next();
	} catch (error) {
		console.error("❌ Error in checkAboutPermission:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

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
			(roleUpper.includes("PG-TK") || roleUpper.includes("TK")) &&
			(namaJenjang.includes("PG-TK") || namaJenjang.includes("TK"))
		)
			return true;

		return false;
	} catch (error) {
		console.error("❌ Error in checkJenjangAccess:", error);
		return false;
	}
}

export const filterAboutByRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const userRole = getNormalizedRole(req);

		if (!userRole) return next();

		console.log("=== FILTER ABOUT BY ROLE ===");
		console.log("Role:", userRole);

		if (userRole.includes("super")) {
			console.log("✅ Superadmin - no filter applied");
			return next();
		}

		const jenjangIds = await getJenjangIdsByRole(userRole);
		console.log("🔍 Allowed jenjang IDs:", jenjangIds);

		if (jenjangIds.length > 0) {
			(req as any).allowedJenjangIds = jenjangIds;
		}

		next();
	} catch (error) {
		console.error("❌ Error in filterAboutByRole:", error);
		next();
	}
};

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
				(roleUpper.includes("PG-TK") || roleUpper.includes("TK")) &&
				(namaJenjang.includes("PG-TK") || namaJenjang.includes("TK"))
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
