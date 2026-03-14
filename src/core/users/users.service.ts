import db from "../../shared/config/db";
import * as bcrypt from "bcrypt";
import { users, Prisma, role, permission } from "@prisma/client";
import { UserCreateInput, UserUpdateInput } from "../../shared/types/prisma";

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
// CRUD User
// ------------------------------------------------------------------
const buatUserBaru = async (userData: UserCreateInput): Promise<UserCreatedOutput> => {
	const salt = await bcrypt.genSalt(10);
	const password_hash = await bcrypt.hash(userData.password, salt);

	const dataToCreate: Prisma.usersCreateInput = {
		...(userData as any),
		password_hash,
	};

	delete (dataToCreate as any).password;

	return await db.users.create({
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
	// Buang semua field yang tidak ada di schema Prisma
	const { role, editor_user_id, login_terakhir, password, ...safeData } = updateData as any;

	let dataToUpdate: Prisma.usersUpdateInput = { ...safeData };

	// Jika ada update password, hash dulu
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
		await db.users.delete({
			where: { user_id: id },
		});
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
				select: {
					permission: true,
				},
			},
		},
	});
};

const lihatDetailRole = async (id: number): Promise<role | null> => {
	return await db.role.findUnique({
		where: { role_id: id },
		include: {
			role_permission: {
				select: {
					permission: true,
				},
			},
		},
	});
};

const buatRoleBaru = async (roleData: { nama_role: string }): Promise<role> => {
	return await db.role.create({
		data: roleData,
	});
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
		await db.role.delete({
			where: { role_id: id },
		});
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
	return await db.permission.findMany({
		orderBy: { grup: "asc" },
	});
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
					select: {
						permission: true,
					},
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
