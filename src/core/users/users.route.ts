import express from "express";
import {
	buatUserBaru,
	lihatSemuaUser,
	lihatSingleUser,
	editUser,
	hapusUser,
} from "./users.controller";
import {
	lihatSemuaRole,
	lihatDetailRole,
	buatRoleBaru,
	editRole as editRoleController,
	hapusRole,
	lihatSemuaPermissionRole,
	updatePermissionRole,
} from "./users.controller";

const router = express.Router();

// ==================================================================
// 1. MANAJEMEN DATA PENGGUNA (CRUD - Khusus Superadmin)
// Path rute ini akan menjadi /users, /users/:id, dll.
// ==================================================================

// 1.1. LIHAT SEMUA USER
router.get(
	"/",
	lihatSemuaUser /**
	 * #swagger
	 * #swagger.tags = ['Users']
	 * #swagger.path = '/api/v1/users/'
	 * #swagger.description = 'Ambil semua daftar pengguna (Khusus Superadmin)'
	 * #swagger.summary = 'LIHAT SEMUA USER'
	 * #swagger.method = 'get'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 1.2. BUAT USER BARU
router.post(
	"/",
	buatUserBaru /**
	 * #swagger
	 * #swagger.tags = ['Users']
	 * #swagger.path = '/api/v1/users/'
	 * #swagger.description = 'Buat akun pengguna baru (Khusus Superadmin)'
	 * #swagger.summary = 'CREATE USER BARU'
	 * #swagger.method = 'post'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// ==================================================================
// 2. MANAJEMEN ROLE (CRUD Role) - Menggunakan sub-path /roles
// Path rute ini akan menjadi /users/roles
// ==================================================================

// 2.1. LIHAT SEMUA ROLE
router.get(
	"/roles",
	lihatSemuaRole /**
	 * #swagger
	 * #swagger.tags = ['Roles & Permissions']
	 * #swagger.path = '/api/v1/users/roles'
	 * #swagger.description = 'Ambil semua daftar Role yang tersedia'
	 * #swagger.summary = 'LIHAT SEMUA ROLE'
	 * #swagger.method = 'get'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 2.2. LIHAT DETAIL ROLE TUNGGAL
router.get(
	"/roles/:id",
	lihatDetailRole /**
	 * #swagger
	 * #swagger.tags = ['Roles & Permissions']
	 * #swagger.path = '/api/v1/users/roles/{:id}'
	 * #swagger.description = 'Ambil detail Role tunggal, termasuk permission yang dimilikinya'
	 * #swagger.summary = 'LIHAT DETAIL ROLE & PERMISSION'
	 * #swagger.method = 'get'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 2.3. BUAT ROLE BARU (CRUD - Create)
router.post(
	"/roles",
	buatRoleBaru /**
	 * #swagger
	 * #swagger.tags = ['Roles & Permissions']
	 * #swagger.path = '/api/v1/users/roles'
	 * #swagger.description = 'Buat Role baru'
	 * #swagger.summary = 'CREATE ROLE BARU'
	 * #swagger.method = 'post'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 2.4. UPDATE ROLE (CRUD - Update)
router.patch(
	"/roles/:id",
	editRoleController /**
	 * #swagger
	 * #swagger.tags = ['Roles & Permissions']
	 * #swagger.path = '/api/v1/users/roles/{:id}'
	 * #swagger.description = 'Update nama/deskripsi Role (PATCH: parsial)'
	 * #swagger.summary = 'UPDATE ROLE'
	 * #swagger.method = 'patch'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 2.5. HAPUS ROLE (CRUD - Delete)
router.delete(
	"/roles/:id",
	hapusRole /**
	 * #swagger
	 * #swagger.tags = ['Roles & Permissions']
	 * #swagger.path = '/api/v1/users/roles/{:id}'
	 * #swagger.description = 'Hapus Role.'
	 * #swagger.summary = 'DELETE ROLE'
	 * #swagger.method = 'delete'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// ==================================================================
// 3. MANAJEMEN PERMISSION ROLE - Menggunakan sub-path /permissions
// ==================================================================

// 3.1. LIHAT SEMUA DAFTAR PERMISSION YANG ADA (Master List)
// Path rute ini akan menjadi /users/permissions/list
router.get(
	"/permissions/list",
	lihatSemuaPermissionRole /**
	 * #swagger
	 * #swagger.tags = ['Roles & Permissions']
	 * #swagger.path = '/api/v1/users/permissions/list'
	 * #swagger.description = 'Ambil semua daftar Permission yang tersedia di sistem'
	 * #swagger.summary = 'LIHAT SEMUA MASTER PERMISSION'
	 * #swagger.method = 'get'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 3.2. UPDATE PERMISSION ROLE TERTENTU (Memberikan/Mencabut Permission)
// Path rute ini akan menjadi /users/roles/:id/permissions
router.put(
	"/roles/:id/permissions",
	updatePermissionRole /**
	 * #swagger
	 * #swagger.tags = ['Roles & Permissions']
	 * #swagger.path = '/api/v1/users/roles/{:id}/permissions'
	 * #swagger.description = 'Mengupdate daftar permission untuk Role tertentu.'
	 * #swagger.summary = 'UPDATE PERMISSION ROLE'
	 * #swagger.method = 'put'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 1.3. LIHAT SINGLE USER
router.get(
	"/:id",
	lihatSingleUser /**
	 * #swagger
	 * #swagger.tags = ['Users']
	 * #swagger.path = '/api/v1/users/{:id}'
	 * #swagger.description = 'Ambil detail pengguna tunggal'
	 * #swagger.summary = 'LIHAT SINGLE USER'
	 * #swagger.method = 'get'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 1.4. EDIT USER (Patch/Put)
router.patch(
	"/:id",
	editUser /**
	 * #swagger
	 * #swagger.tags = ['Users']
	 * #swagger.path = '/api/v1/users/{:id}'
	 * #swagger.description = 'Update data user (PATCH: parsial)'
	 * #swagger.summary = 'UPDATE USER'
	 * #swagger.method = 'patch'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

// 1.5. HAPUS USER
router.delete(
	"/:id",
	hapusUser /**
	 * #swagger
	 * #swagger.tags = ['Users']
	 * #swagger.path = '/api/v1/users/{:id}'
	 * #swagger.description = 'Hapus akun pengguna'
	 * #swagger.summary = 'DELETE USER'
	 * #swagger.method = 'delete'
	 * #swagger.security = [{ "BearerAuth": [] }]
	 */
);

export default router;
