import db from "../../shared/config/db";
import * as bcrypt from "bcrypt";
import { users, Prisma, role, permission } from "@prisma/client";
import { UserCreateInput, UserUpdateInput } from "../../shared/types/prisma";
import nodemailer from "nodemailer";

type UserCreatedOutput = Prisma.usersGetPayload<{
	select: {
		user_id: true;
		username: true;
		email: true;
		nama_lengkap: true;
		role_id: true;
		jabatan: true;
		created_at: true;
		role: { select: { nama_role: true } };
	};
}>;

// ------------------------------------------------------------------
// Helper: generate password random yang kuat
// Format: 3 huruf besar + 3 angka + 3 huruf kecil + 2 simbol
// Contoh: ABc123xyz@#
// ------------------------------------------------------------------
const generateStrongPassword = (): string => {
	const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	const lower = "abcdefghjkmnpqrstuvwxyz";
	const digits = "23456789";
	const symbols = "@#$!";

	const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];

	const parts = [
		getRandom(upper),
		getRandom(upper),
		getRandom(upper),
		getRandom(digits),
		getRandom(digits),
		getRandom(digits),
		getRandom(lower),
		getRandom(lower),
		getRandom(lower),
		getRandom(symbols),
		getRandom(symbols),
	];

	// Shuffle agar tidak selalu pola yang sama
	return parts.sort(() => Math.random() - 0.5).join("");
};

// ------------------------------------------------------------------
// Helper: kirim email password awal ke user baru
// ------------------------------------------------------------------
const sendPasswordEmail = async (
	email: string,
	namaLengkap: string,
	username: string,
	password: string,
	namaRole: string
): Promise<void> => {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.EMAIL_USER?.trim(),
			pass: process.env.EMAIL_PASSWORD?.trim()?.replace(/\s/g, ""),
		},
	});

	await transporter.sendMail({
		from: `"Admin WR Supratman" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Akun Dashboard Admin Anda Telah Dibuat",
		html: `
      <!DOCTYPE html>
      <html lang="id">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;">
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- HEADER -->
          <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:30px 20px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:600;">Perguruan WR Supratman</h1>
            <p style="color:#e0e7ff;margin:5px 0 0;font-size:13px;">Sistem Informasi Dashboard Admin</p>
          </div>

          <!-- BODY -->
          <div style="padding:35px 30px;">
            <h2 style="color:#1e293b;margin:0 0 10px;font-size:18px;">Halo, ${namaLengkap}!</h2>
            <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 25px;">
              Akun dashboard admin Anda telah berhasil dibuat oleh administrator sistem. 
              Berikut adalah informasi login Anda:
            </p>

            <!-- CREDENTIALS BOX -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:0 0 25px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;width:40%;">URL Dashboard</td>
                  <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;">
                    : <a href="http://localhost:5174" style="color:#3b82f6;">localhost:5174</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;">Username</td>
                  <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;">: ${username}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td>
                  <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;">: ${email}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;">Password</td>
                  <td style="padding:8px 0;">
                    <span style="background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:6px;font-family:monospace;font-size:16px;font-weight:bold;letter-spacing:2px;">${password}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;">Role</td>
                  <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;">: ${namaRole}</td>
                </tr>
              </table>
            </div>

            <!-- WARNING -->
            <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:15px;border-radius:6px;margin:0 0 20px;">
              <p style="margin:0;font-size:13px;color:#991b1b;line-height:1.6;">
                <strong>⚠️ Penting:</strong> Segera ganti password Anda setelah login pertama kali. 
                Jangan bagikan password ini kepada siapapun.
              </p>
            </div>

            <p style="font-size:13px;color:#64748b;line-height:1.6;">
              Jika Anda tidak merasa mendaftar atau ada pertanyaan, silakan hubungi administrator sistem.
            </p>
          </div>

          <!-- FOOTER -->
          <div style="background:#f8fafc;padding:20px 30px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              Email ini dikirim otomatis. Mohon tidak membalas email ini.
            </p>
            <p style="margin:5px 0 0;font-size:12px;color:#94a3b8;">
              © 2026 Perguruan WR Supratman 1, Medan
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
	});
};

// ------------------------------------------------------------------
// CRUD User
// ------------------------------------------------------------------
const buatUserBaru = async (userData: UserCreateInput): Promise<UserCreatedOutput> => {
	// ✅ Auto-generate password jika tidak dikirim dari frontend
	const plainPassword = generateStrongPassword();

	const salt = await bcrypt.genSalt(10);
	const password_hash = await bcrypt.hash(plainPassword, salt);

	const dataToCreate: Prisma.usersCreateInput = {
		...(userData as any),
		password_hash,
	};

	// Bersihkan field yang tidak ada di schema
	delete (dataToCreate as any).password;
	delete (dataToCreate as any).penulis_user_id;

	const userBaru = await db.users.create({
		data: dataToCreate,
		select: {
			user_id: true,
			username: true,
			email: true,
			nama_lengkap: true,
			role_id: true,
			jabatan: true,
			created_at: true,
			role: {
				select: { nama_role: true },
			},
		},
	});

	// ✅ Kirim email password ke user baru (non-fatal jika gagal)
	try {
		await sendPasswordEmail(
			userBaru.email,
			userBaru.nama_lengkap,
			userBaru.username,
			plainPassword,
			userBaru.role.nama_role
		);
	} catch (emailErr) {
		console.warn("Gagal kirim email password (non-fatal):", emailErr);
	}

	return userBaru;
};

const lihatSemuaUser = async () => {
	return await db.users.findMany({
		include: {
			role: {
				include: {
					role_permission: {
						include: {
							permission: true,
						},
					},
				},
			},
		},
	});
};

const lihatSingleUser = async (id: string): Promise<users | null> => {
	return await db.users.findUnique({
		where: { user_id: id },
		include: {
			role: {
				include: {
					role_permission: {
						include: {
							permission: true,
						},
					},
				},
			},
		},
	});
};

const editUser = async (id: string, updateData: UserUpdateInput): Promise<users | null> => {
	const { role, editor_user_id, login_terakhir, password, ...safeData } = updateData as any;

	let dataToUpdate: Prisma.usersUpdateInput = { ...safeData };

	if (password) {
		const salt = await bcrypt.genSalt(10);
		dataToUpdate.password_hash = await bcrypt.hash(password, salt);
	}

	try {
		return db.users.update({
			where: { user_id: id },
			data: dataToUpdate,
			include: { role: true },
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			return null;
		}
		throw error;
	}
};

const hapusUser = async (id: string): Promise<boolean> => {
	try {
		await db.users.delete({ where: { user_id: id } });
		return true;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			return false;
		}
		throw error;
	}
};

// ------------------------------------------------------------------
// CRUD Role
// ------------------------------------------------------------------
const updateUserRole = async (id: string, roleId: number): Promise<users | null> => {
	try {
		return db.users.update({
			where: { user_id: id },
			data: { role_id: roleId },
			include: { role: true },
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			return null;
		}
		throw error;
	}
};

const lihatSemuaUserRole = async (): Promise<role[]> => {
	return await db.role.findMany({
		include: {
			role_permission: {
				select: { permission: true },
			},
		},
	});
};

const lihatDetailRole = async (id: number): Promise<role | null> => {
	return await db.role.findUnique({
		where: { role_id: id },
		include: {
			role_permission: {
				select: { permission: true },
			},
		},
	});
};

const buatRoleBaru = async (roleData: { nama_role: string }): Promise<role> => {
	return await db.role.create({ data: roleData });
};

const editRole = async (id: number, updateData: { nama_role: string }): Promise<role | null> => {
	try {
		return await db.role.update({
			where: { role_id: id },
			data: updateData,
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			return null;
		}
		throw error;
	}
};

const hapusRole = async (id: number): Promise<boolean> => {
	try {
		await db.role.delete({ where: { role_id: id } });
		return true;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			return false;
		}
		throw error;
	}
};

// ------------------------------------------------------------------
// Permission Management
// ------------------------------------------------------------------
const lihatSemuaUserPermission = async (): Promise<permission[]> => {
	return await db.permission.findMany({ orderBy: { grup: "asc" } });
};

const updatePermission = async (roleId: number, permission_ids: number[]): Promise<role | null> => {
	try {
		await db.role_permission.deleteMany({ where: { role_id: roleId } });

		if (permission_ids) {
			await db.role_permission.createMany({
				data: permission_ids.map((permId) => ({
					role_id: roleId,
					permission_id: permId,
				})),
			});
		}

		return await db.role.findUnique({
			where: { role_id: roleId },
			include: {
				role_permission: {
					select: { permission: true },
				},
			},
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			return null;
		}
		throw error;
	}
};

export default {
	buatUserBaru,
	lihatSemuaUser,
	lihatSingleUser,
	editUser,
	hapusUser,
	updateUserRole,
	lihatSemuaUserRole,
	lihatDetailRole,
	buatRoleBaru,
	editRole,
	hapusRole,
	lihatSemuaUserPermission,
	updatePermission,
};
