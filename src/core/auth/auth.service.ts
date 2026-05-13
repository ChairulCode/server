import db from "../../shared/config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../../shared/middlewares/mailing_service";

const JWT_SECRET = process.env.JWT_SECRET;
const RESET_SECRET = process.env.RESET_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
if (!RESET_SECRET) throw new Error("RESET_SECRET is not defined");

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	console.error("Unknown error caught in authService:", error);
	return "Terjadi kesalahan yang tidak diketahui.";
};

const login = async ({ email, password }: { email: string; password: string }) => {
	try {
		const user = await db.users.findUnique({
			where: { email },
			include: { role: true },
		});

		if (!user) throw new Error("Email tidak ditemukan");

		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordValid) throw new Error("Password salah.");

		await db.users.update({
			where: { user_id: user.user_id },
			data: { login_terakhir: new Date().toISOString() },
		});

		const accessToken = jwt.sign(
			{
				userInfo: {
					user_id: user.user_id,
					email: user.email,
					username: user.username,
					role: user.role.nama_role,
					login_terakhir: user.login_terakhir,
				},
			},
			JWT_SECRET,
			{ expiresIn: "6h" }
		);

		const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;

		return {
			token: {
				apiKey: accessToken,
				crt: decodedToken.iat,
				exp: decodedToken.exp,
			},
			userInfo: {
				user_id: user.user_id,
				email: user.email,
				username: user.username,
				role: user.role.nama_role,
				login_terakhir: user.login_terakhir,
			},
		};
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
};

const register = async (data: {
	username: string;
	email: string;
	nama_lengkap: string;
	password: string;
	role_id: number;
}) => {
	try {
		const hashedPassword = await bcrypt.hash(data.password, 10);

		const newUser = await db.users.create({
			data: {
				username: data.username,
				email: data.email,
				nama_lengkap: data.nama_lengkap,
				password_hash: hashedPassword,
				role_id: data.role_id,
			},
			select: { user_id: true, username: true, email: true, nama_lengkap: true },
		});

		return newUser;
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		if (errorMessage.includes("P2002")) {
			throw new Error("Email atau username sudah digunakan.");
		}
		throw new Error(errorMessage);
	}
};

// ✅ FIX: return { found } flag agar controller bisa bedakan email ada/tidak
const forgotPassword = async (email: string) => {
	try {
		const user = await db.users.findUnique({ where: { email } });

		if (!user) {
			return { found: false };
		}

		const resetToken = jwt.sign({ user_id: user.user_id }, RESET_SECRET, { expiresIn: "10m" });

		await sendResetEmail(email, resetToken);

		return { found: true };
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
};

const resetPassword = async (token: string, newPassword: string) => {
	let decoded: jwt.JwtPayload;

	try {
		decoded = jwt.verify(token, RESET_SECRET) as jwt.JwtPayload;
		if (!decoded.user_id) {
			throw new Error("Token reset tidak valid: User ID hilang.");
		}
	} catch (error) {
		throw new Error("Token reset tidak valid atau sudah kadaluarsa.");
	}

	const newHashedPassword = await bcrypt.hash(newPassword, 10);

	const updatedUser = await db.users.update({
		where: { user_id: decoded.user_id as string },
		data: { password_hash: newHashedPassword },
		select: { user_id: true, email: true },
	});

	if (!updatedUser) throw new Error("Gagal mengupdate password.");

	return { message: "Password berhasil direset.", user: updatedUser };
};

export default { login, register, forgotPassword, resetPassword };
