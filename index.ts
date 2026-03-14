import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import path from "path";

config();
const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARES
import authenticateJWT from "./src/shared/middlewares/jwtVerification";
import session_middleware from "./src/shared/middlewares/session_server";

app.use(morgan("dev"));
app.use(session_middleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			"https://wr-supratman-server.vercel.app",
			"https://perguruan-wr-supratman.vercel.app",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
		optionsSuccessStatus: 200,
	})
);

// ROUTES
import swaggerDocument from "./src/shared/config/swagger-output.json";
import beritaRoutes from "./src/core/achievements/achievements.route";
import kegiatanRoutes from "./src/core/activities/activities.route";
import pengumumanRoutes from "./src/core/announcements/announcements.route";
import authRoutes from "./src/core/auth/auth.route";
import siswaRoutes from "./src/core/students/students.route";
import orangTuaRoutes from "./src/core/parents/parents.route";
import userRoutes from "./src/core/users/users.route";
import carouselRoutes from "./src/core/carousels/carousels.route";
import fileUploadRoutes from "./src/core/galleries/galleries.route";
import jenjangRoutes from "./src/core/jenjang/jenjang.route";
import socialMediaRoutes from "./src/core/social/social.route";
import GraduationRoute from "./src/core/graduationannouncement/graduation.route";
import SubjectGradesRoute from "./src/core/subjectgrades/subjectgrades.routes";
import pendaftaranRoutes from "./src/core/pendaftaran/pendaftaran.route";
import mataPelajaranRoutes from "./src/core/matapelajaran/matapelajaran.route";
import prisma from "./src/shared/config/db";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/prestasi", beritaRoutes);
app.use("/api/v1/kegiatan", kegiatanRoutes);
app.use("/api/v1/pengumuman", pengumumanRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/siswa", authenticateJWT, siswaRoutes);
app.use("/api/v1/orang-tua", authenticateJWT, orangTuaRoutes);
app.use("/api/v1/users", authenticateJWT, userRoutes);
app.use("/api/v1/carousels", carouselRoutes);
app.use("/api/v1/galleries", fileUploadRoutes);
app.use("/api/v1/jenjang", jenjangRoutes);
app.use("/api/v1/sosial", socialMediaRoutes);
app.use("/api/v1/graduation", GraduationRoute);
app.use("/api/v1/subject-grades", SubjectGradesRoute);
app.use("/api/v1/pendaftaran", pendaftaranRoutes);
app.use("/api/v1/mata-pelajaran", mataPelajaranRoutes);

// STATIC
app.use("/activities", express.static(path.join(__dirname, "./public/activities")));
app.use("/announcements", express.static(path.join(__dirname, "./public/announcements")));
app.use("/achievements", express.static(path.join(__dirname, "./public/achievements")));
app.use("/carousels", express.static(path.join(__dirname, "./public/carousels")));
app.use("/pendaftaran", express.static(path.join(__dirname, "./public/pendaftaran")));
app.use("/graduation", express.static(path.join(__dirname, "./public/graduation")));

// ERROR HANDLER
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({
		message: err.message,
		error: process.env.NODE_ENV === "production" ? {} : err,
	});
});

app.get("/", async (req: Request, res: Response) => {
	res.json("Server is running!");
});

// SERVERLESS
if (process.env.NODE_ENV !== "production") {
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
		console.log(`Dokumentasi API tersedia di http://localhost:${PORT}/api-docs`);
	});
}

process.on("SIGINT", async () => {
	console.log("\n🛑 Server dihentikan...");
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await prisma.$disconnect();
	process.exit(0);
});

export default app;
