import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateNoPendaftaran(): Promise<string> {
	const year = new Date().getFullYear();
	const month = String(new Date().getMonth() + 1).padStart(2, "0");
	const prefix = `PSB${year}${month}`; // PSB = Penerimaan Siswa Baru

	const lastPendaftaran = await prisma.pendaftaran.findFirst({
		where: {
			noPendaftaran: {
				startsWith: prefix,
			},
		},
		orderBy: {
			noPendaftaran: "desc",
		},
	});

	let sequence = 1;
	if (lastPendaftaran) {
		const lastSequence = parseInt(lastPendaftaran.noPendaftaran.slice(-4));
		sequence = lastSequence + 1;
	}

	const noPendaftaran = `${prefix}${String(sequence).padStart(4, "0")}`;
	// Format: PSB202602XXXX
	return noPendaftaran;
}
