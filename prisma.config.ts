import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "node prisma/seed.js",
	},
	datasource: {
		// Ganti env("DATABASE_URL") menjadi process.env.DATABASE_URL
		url: process.env.DATABASE_URL,
	},
});
