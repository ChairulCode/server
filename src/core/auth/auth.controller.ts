import { Request, Response } from "express";
import authService from "./auth.service";

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Terjadi kesalahan yang tidak diketahui.";
};

export const login = async (req: Request, res: Response) => {
	try {
		const result = await authService.login(req.body);
		res.status(200).json({ message: "Login berhasil", data: result });
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		const status = errorMessage.includes("salah") ? 401 : 500;
		res.status(status).json({ message: "Gagal Login", serverMessage: errorMessage });
	}
};

export const register = async (req: Request, res: Response) => {
	try {
		const newUser = await authService.register(req.body);
		res.status(201).json({ message: "Registrasi berhasil", data: newUser });
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		const status = errorMessage.includes("terdaftar") ? 409 : 500;
		res.status(status).json({ message: "Gagal Registrasi", serverMessage: errorMessage });
	}
};

// ✅ FIX UTAMA: tambah res.json() + bedakan 404 vs 200
export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const result = await authService.forgotPassword(email);

		if (!result.found) {
			return res.status(404).json({
				message: "Email tidak terdaftar dalam sistem.",
			});
		}

		return res.status(200).json({
			message: "Link reset password telah dikirim ke email Anda.",
		});
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		return res.status(500).json({
			message: "Gagal memproses permintaan reset",
			serverMessage: errorMessage,
		});
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { token } = req.query;
		const tokenString = typeof token === "string" ? token : "";

		if (!tokenString) {
			return res.status(400).json({ message: "Token reset password tidak ditemukan." });
		}

		const { password } = req.body;
		const result = await authService.resetPassword(tokenString, password);
		res.status(200).json({ message: result.message });
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		const status = errorMessage.includes("kadaluarsa") ? 400 : 500;
		res.status(status).json({ message: "Gagal mereset password", serverMessage: errorMessage });
	}
};
