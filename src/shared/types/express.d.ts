import { Request } from "express";

export interface JwtUserPayload {
	token: {
		apiKey: string;
		crt: number;
		exp: number;
	};
	userInfo: {
		user_id: string;
		username: string;
		role: string;
	};
}

export interface csrfToken {
	(): string;
}

declare module "express-serve-static-core" {
	/**
	 * Menggabungkan interface 'Request' bawaan Express.
	 * Properti 'user' kini tersedia di req.user setelah middleware.
	 */
	interface Request {
		user?: JwtUserPayload | string | jwt.JwtPayload;
		csrfToken?: csrfToken;
	}
}
