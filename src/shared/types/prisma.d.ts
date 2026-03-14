import { Prisma } from "@prisma/client";

// ====================================================
// ENUMERATOR (WAJIB SINKRON DENGAN ENUM PRISMA)
// ====================================================

export enum PermissionGrup {
	dashboard = "dashboard",
	user = "user",
	user_roles = "user_roles",
	user_roles_permissions = "user_roles_permissions",
	siswa = "siswa",
	prestasi = "prestasi",
	kegiatan = "kegiatan",
	pengumuman = "pengumuman",
	carousel = "carousel",
	foto = "foto",
	sosmed = "sosmed",
}

// ====================================================
// 1. CORE & MASTER DATA
// ====================================================

export interface Role {
	role_id: number;
	nama_role: string;
}

export interface Permission {
	permission_id: number;
	nama_permission: string;
	grup: PermissionGrup | null;
}

export interface RolePermission {
	role_id: number;
	permission_id: number;
}

export interface User {
	user_id: string; // UUID
	username: string;
	email: string;
	password_hash: string;
	nama_lengkap: string;
	role_id: number;
	jabatan: string | null;
	is_aktif?: boolean;
	created_at: Date | null;
	updated_at: Date | null;
	nomor_telefon: string | null;
	login_terakhir: Date | null;
	foto_profil_url: string | null;
	is_verified?: boolean;
}

export interface Jenjang {
	jenjang_id: string; // UUID
	nama_jenjang: string;
	kode_jenjang: string;
}

// ====================================================
// 2. JUNCTION TABLES (UNTUK M:M ANTARA KONTEN & JENJANG)
// ====================================================

export interface PrestasiJenjang {
	prestasi_id: string;
	jenjang_id: string;
}

export interface KegiatanJenjang {
	kegiatan_id: string;
	jenjang_id: string;
}

export interface PengumumanJenjang {
	pengumuman_id: string;
	jenjang_id: string;
}

// ====================================================
// 3. MODEL KONTEN
// ====================================================

export interface Prestasi {
	prestasi_id: string; // UUID
	judul: string;
	deskripsi: string | null;
	konten: string;
	path_gambar: string | null;
	tanggal_publikasi: Date;
	is_published?: boolean;
	is_featured?: boolean;
	created_at: Date | null;
	updated_at: Date;

	penulis_user_id: string; // UUID
	editor_user_id: string | null; // UUID

	jenjang_relasi?: PrestasiJenjang[];
}

interface PrestasiInput {
	judul: string;
	deskripsi: string | null;
	konten: string;
	path_gambar: string | null;
	tanggal_publikasi: Date;

	is_published?: boolean;
	is_featured?: boolean;

	penulis_user_id: string; // UUID
	editor_user_id: string | null; // UUID

	// Field untuk relasi M:M (Array UUID Jenjang)
	jenjang_ids?: string[];
}

export interface Kegiatan {
	kegiatan_id: string; // UUID
	judul: string;
	deskripsi: string | null;
	konten: string;
	path_gambar: string | null;
	tanggal_publikasi: Date;

	is_published?: boolean;
	is_featured?: boolean;
	created_at: Date | null;
	updated_at: Date;

	penulis_user_id: string; // UUID
	editor_user_id: string | null;

	jenjang_ids?: string[];
}

interface KegiatanInput {
	judul: string;
	deskripsi: string | null;
	konten: string;
	path_gambar: string | null;
	tanggal_publikasi: Date;

	is_published?: boolean;
	is_featured?: boolean;

	penulis_user_id: string; // UUID
	editor_user_id: string | null; // UUID

	// Field untuk relasi M:M (Array UUID Jenjang)
	jenjang_ids?: string[];
}

export interface Pengumuman {
	pengumuman_id: string; // UUID
	judul: string;
	deskripsi: string;
	konten: string | null;

	prioritas: PrioritasPengumuman | null;

	tanggal_publikasi: Date;

	penulis_user_id: string; // UUID
	editor_user_id: string | null;
	is_featured?: boolean;

	created_at: Date | null;
	updated_at: Date;

	jenjang_relasi?: PengumumanJenjang[];
}

interface PengumumanInput {
	judul: string;
	deskripsi: string | null;
	konten: string;
	tanggal_publikasi: Date;

	is_published?: boolean;
	is_featured?: boolean;

	penulis_user_id: string; // UUID
	editor_user_id: string | null; // UUID

	// Field untuk relasi M:M (Array UUID Jenjang)
	jenjang_ids?: string[];
}

// ====================================================
// 4. MODEL TAMBAHAN
// ====================================================

export interface Galleries {
	pic_id: string; // UUID
	path_file: string;
	alt: string | null;
	caption: string | null;
	created_at: Date | null;
	updated_at: Date;
}

export interface Carousel {
	carousel_id: string; // UUID
	judul: string;
	urutan: number;
	konten: string;
	path_gambar: string;
	tanggal_publikasi: Date;
	is_published?: boolean;
	is_featured?: boolean;
	created_at: Date | null;
	updated_at: Date;

	jenjang_id: string | null; // UUID
	penulis_user_id: string; // UUID
	editor_user_id: string | null; // UUID
}

// 1. Tipe untuk Data Input saat CREATE (POST /users)
// Kita gunakan Prisma.UserCreateInput, tapi kita modifikasi:
// - Hapus 'password_hash' (kita akan generate di service)
// - Tambahkan 'password' (yang diinput oleh user/admin)

export type UserCreateInput = Omit<Prisma.usersCreateInput, "password_hash"> & {
	password: string;
};

// 2. Tipe untuk Data Input saat UPDATE (PATCH /users/:id)
// Kita gunakan Prisma.UserUpdateInput, tapi kita modifikasi:
// - Hapus 'password_hash'
// - Jadikan semua properti opsional (Partial)
// - Tambahkan 'password' (opsional)

export type UserUpdateInput = Partial<Omit<Prisma.usersUpdateInput, "password_hash">> & {
	password?: string;
};

// Catatan:
// Omit<T, K> digunakan untuk menghapus properti K dari tipe T.
// Partial<T> digunakan untuk menjadikan semua properti di tipe T opsional (?).
