import { Request, Response } from "express";
import UserService from "./users.service";

const handleServiceError = (res: Response, err: unknown) => {
	console.error(err);
	return res.status(500).json({
		message: "Server Error",
		serverMessage: err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.",
	});
};

// ==========================================================
// 1. CRUD USER (Endpoint: /users/)
// ==========================================================
const buatUserBaru = async (req: Request, res: Response) => {
	try {
		const userData = req.body;
		const userBaru = await UserService.buatUserBaru(userData);

		return res.status(201).json({
			message: "Pengguna berhasil dibuat.",
			data: userBaru,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const lihatSemuaUser = async (req: Request, res: Response) => {
	try {
		const semuaUser = await UserService.lihatSemuaUser();

		return res.status(200).json({
			message: "Daftar pengguna berhasil diambil.",
			data: semuaUser,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const lihatSingleUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await UserService.lihatSingleUser(id);

		if (!user) {
			return res.status(404).json({ message: `Pengguna dengan ID ${id} tidak ditemukan.` });
		}

		return res.status(200).json({
			message: "Detail pengguna berhasil diambil.",
			data: user,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const editUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const userDiperbarui = await UserService.editUser(id, updateData);

		if (!userDiperbarui) {
			return res.status(404).json({ message: `Pengguna dengan ID ${id} tidak ditemukan.` });
		}

		return res.status(200).json({
			message: "Pengguna berhasil diperbarui.",
			data: userDiperbarui,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const hapusUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const isDihapus = await UserService.hapusUser(id);

		if (!isDihapus) {
			return res.status(404).json({ message: `Pengguna dengan ID ${id} tidak ditemukan.` });
		}

		return res.status(200).json({
			message: `Pengguna dengan ID ${id} berhasil dihapus.`,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

// ==========================================================
// 2. CRUD ROLE (Endpoint: /users/roles)
// ==========================================================
const updateUserRole = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { role_id } = req.body;

		const userDiperbarui = await UserService.updateUserRole(id, role_id);

		if (!userDiperbarui) {
			return res.status(404).json({ message: `Pengguna dengan ID ${id} tidak ditemukan.` });
		}

		return res.status(200).json({
			message: `Role pengguna ID ${id} berhasil diperbarui menjadi ${role_id}.`,
			data: userDiperbarui,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const lihatSemuaRole = async (req: Request, res: Response) => {
	try {
		const semuaRole = await UserService.lihatSemuaUserRole();

		return res.status(200).json({
			message: "Daftar role berhasil diambil.",
			data: semuaRole,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const lihatDetailRole = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const roleDetail = await UserService.lihatDetailRole(Number(id));

		if (!roleDetail) {
			return res.status(404).json({ message: `Role dengan ID ${id} tidak ditemukan.` });
		}

		return res.status(200).json({
			message: "Detail role berhasil diambil.",
			data: roleDetail,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const buatRoleBaru = async (req: Request, res: Response) => {
	try {
		const roleData = req.body;
		const roleBaru = await UserService.buatRoleBaru(roleData);

		return res.status(201).json({
			message: "Role baru berhasil dibuat.",
			data: roleBaru,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const editRole = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const roleDiperbarui = await UserService.editRole(Number(id), updateData);

		if (!roleDiperbarui) {
			return res.status(404).json({ message: `Role dengan ID ${id} tidak ditemukan.` });
		}

		return res.status(200).json({
			message: "Role berhasil diperbarui.",
			data: roleDiperbarui,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const hapusRole = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const isDihapus = await UserService.hapusRole(Number(id));

		if (!isDihapus) {
			return res.status(404).json({ message: `Role dengan ID ${id} tidak ditemukan.` });
		}
		return res.status(200).json({
			message: `Role dengan ID ${id} berhasil dihapus.`,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

// ==========================================================
// 3. CRUD PERMISSION (Endpoint: /users/permissions)
// ==========================================================
const lihatSemuaPermissionRole = async (req: Request, res: Response) => {
	try {
		const semuaPermission = await UserService.lihatSemuaUserPermission();

		return res.status(200).json({
			message: "Daftar master permission berhasil diambil.",
			data: semuaPermission,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

const updatePermissionRole = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { permission_ids } = req.body;

		const roleDiperbarui = await UserService.updatePermission(Number(id), permission_ids);

		if (!roleDiperbarui) {
			return res.status(404).json({ message: `Role dengan ID ${id} tidak ditemukan.` });
		}

		return res.status(200).json({
			message: `Permission untuk Role ID ${id} berhasil diperbarui.`,
			data: roleDiperbarui,
		});
	} catch (err) {
		handleServiceError(res, err);
	}
};

export {
	buatUserBaru,
	lihatSemuaUser,
	lihatSingleUser,
	hapusUser,
	editUser,
	lihatSemuaRole,
	lihatDetailRole,
	buatRoleBaru,
	updateUserRole,
	editRole,
	hapusRole,
	lihatSemuaPermissionRole,
	updatePermissionRole,
};
