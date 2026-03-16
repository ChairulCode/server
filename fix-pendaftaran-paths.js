const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fixPath = (p) => {
	if (!p) return p;
	return p.replace(/\\/g, "/").replace(/^public\//, "");
};

async function checkAndFixPaths() {
	const data = await prisma.pendaftaran.findMany({
		select: {
			id: true,
			noPendaftaran: true,
			akteLahirUrl: true,
			kartuKeluargaUrl: true,
			buktiTransferUrl: true,
		},
	});

	console.log(`\nTotal pendaftaran: ${data.length}`);
	console.log("\n========== CEK PATH SEKARANG ==========");

	let needFix = 0;

	for (const item of data) {
		const paths = [
			{ field: "akteLahirUrl", value: item.akteLahirUrl },
			{ field: "kartuKeluargaUrl", value: item.kartuKeluargaUrl },
			{ field: "buktiTransferUrl", value: item.buktiTransferUrl },
		];

		let hasIssue = false;
		for (const p of paths) {
			if (p.value) {
				console.log(`[${item.noPendaftaran}] ${p.field}: "${p.value}"`);
				if (p.value.includes("\\") || p.value.startsWith("public/")) {
					hasIssue = true;
				}
			}
		}
		if (hasIssue) needFix++;
	}

	if (needFix === 0) {
		console.log("\nSemua path sudah benar format-nya.");
		console.log("Masalah mungkin ada di frontend — cara membuat URL dari path ini.");
		await prisma.$disconnect();
		return;
	}

	console.log(`\n${needFix} record perlu difix.`);
	console.log("\n========== FIXING PATHS ==========");

	let fixed = 0;
	for (const item of data) {
		const newAkte = fixPath(item.akteLahirUrl);
		const newKK = fixPath(item.kartuKeluargaUrl);
		const newBukti = fixPath(item.buktiTransferUrl);

		const needsUpdate =
			newAkte !== item.akteLahirUrl ||
			newKK !== item.kartuKeluargaUrl ||
			newBukti !== item.buktiTransferUrl;

		if (needsUpdate) {
			await prisma.pendaftaran.update({
				where: { id: item.id },
				data: {
					akteLahirUrl: newAkte,
					kartuKeluargaUrl: newKK,
					buktiTransferUrl: newBukti,
				},
			});
			console.log(`[${item.noPendaftaran}] Fixed:`);
			if (newAkte !== item.akteLahirUrl)
				console.log(`  akteLahirUrl:     "${item.akteLahirUrl}" → "${newAkte}"`);
			if (newKK !== item.kartuKeluargaUrl)
				console.log(`  kartuKeluargaUrl: "${item.kartuKeluargaUrl}" → "${newKK}"`);
			if (newBukti !== item.buktiTransferUrl)
				console.log(`  buktiTransferUrl: "${item.buktiTransferUrl}" → "${newBukti}"`);
			fixed++;
		}
	}

	console.log(`\n========== SELESAI ==========`);
	console.log(`Total difix: ${fixed} record`);
	await prisma.$disconnect();
}

checkAndFixPaths().catch(async (e) => {
	console.error(e);
	await prisma.$disconnect();
	process.exit(1);
});
