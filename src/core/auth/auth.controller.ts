import { Request, Response } from "express";
import authService from "./auth.service";

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
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
		const status = errorMessage.includes("terdaftar") ? 409 : 500; // 409 Conflict
		res.status(status).json({ message: "Gagal Registrasi", serverMessage: errorMessage });
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		await authService.forgotPassword(email);
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		res
			.status(500)
			.json({ message: "Gagal memproses permintaan reset", serverMessage: errorMessage });
	}
};

// DI FILE auth.controller.ts
export const resetPassword = async (req: Request, res: Response) => {
	try {
		// Ambil token dari query string (?token=...)
		const { token } = req.query;

		// Pastikan token ada dan berbentuk string tunggal
		const tokenString = typeof token === "string" ? token : "";

		if (!tokenString) {
			return res.status(400).json({ message: "Token reset password tidak ditemukan." });
		}

		const { password } = req.body;

		// Kirim tokenString ke service
		const result = await authService.resetPassword(tokenString, password);
		res.status(200).json({ message: result.message });
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		const status = errorMessage.includes("kadaluarsa") ? 400 : 500;
		res.status(status).json({ message: "Gagal mereset password", serverMessage: errorMessage });
	}
};
