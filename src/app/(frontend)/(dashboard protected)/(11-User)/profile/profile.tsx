"use client";

import Modals from "./src/components/Modals";
import { useModals } from "./src/hooks/useModals";
import type { DataAccessLayer } from "./src/utils/ksr_jwt";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";


export default function Profile({ data }: { data: DataAccessLayer }) {
    const router = useRouter();
    const [tabSelected, setTabSelected] = useState<"profileSettings" | "passwordChange" | "deleteAccount">("profileSettings");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(data.avatarUrl);
    const [uploading, setUploading] = useState<boolean>(false);
    const [process, setProcess] = useState<boolean>(false);
    const { modals, modalsError, modalsSuccess, modalsWarning, modalsInfo } = useModals();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploading) return modalsInfo("Harap tunggu, sedang mengupload gambar sebelumnya");
        const file = e.target.files?.[0];
        if (!file) return modalsWarning("Tidak ada file yang diupload !");

        const formData = new FormData();
        formData.append('file', file);
        try {
            setUploading(true);
            const res = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json();
            setUploading(false);

            if (!data.status) {
                modalsError(data.msg[0]?.message || data.msg);
            } else {
                setAvatarUrl(data.data);
            }
        } catch {
            setUploading(false);
            modalsError("Terjadi kesalahan saat mengupload gambar");
        }
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        if (process) return modalsInfo("Harap tunggu, proses sebelumnya belum selesai");
        const formData = new FormData(e.currentTarget);
        try {
            setProcess(true);
            const res = await fetch("/api/change-password", {
                body: formData,
                method: "POST"
            });
            const result = await res.json();
            setProcess(false);

            if (!result.status) return modalsWarning(result.msg[0].message || result.msg);
            modalsSuccess(result.data);
        } catch {
            setProcess(false);
            modalsError("Terjadi kesalahan saat mengubah password");
        }
    }

    const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        if (process) return modalsInfo("Harap tunggu, proses sebelumnya belum selesai");
        const formData = new FormData(e.currentTarget);

        try {
            setProcess(true);
            const res = await fetch("/api/delete-account", {
                body: formData,
                method: "DELETE"
            });
            const result = await res.json();
            setProcess(false);

            if (!result.status) return modalsWarning(result.msg[0].message || result.msg);
            modalsSuccess(result.data);
            router.push("/login");
        } catch {
            setProcess(false);
            modalsError("Terjadi kesalahan saat menghapus akun");
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        if (process) return modalsInfo("Harap tunggu, proses sebelumnya belum selesai");
        if (uploading) return modalsInfo("Harap tunggu, sedang mengupload gambar");
        const formData = new FormData(e.currentTarget);
        const nameChange = formData.get("name") == data.name;
        const emailChange = formData.get("email") == data.email;
        const avatarChange = data.avatarUrl == avatarUrl;
        if (avatarChange && nameChange && emailChange) return modalsWarning("Tidak ada data yang berubah");

        try {
            setProcess(true);
            // kirim ke server misalnya
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: formData.get("name"), avatarUrl, email: formData.get("email") || null })
            });

            const result = await res.json();
            setProcess(false);
            if (result.status) {
                if (avatarChange || nameChange || emailChange) router.refresh();
                modalsSuccess(result.data)
            }
            else modalsError(result.msg[0]?.message || result.msg);
        } catch {
            setProcess(false);
            modalsError("Terjadi kesalahan saat memperbarui profil");
        }
    };

    return (
        <>
            <Modals status={modals} loading={uploading || process} loadingMessage={!uploading ? "Memproses..." : "Sedang mengupload gambar..."} />

            <section>
                <h1 className="text-2xl font-bold text-center md:text-left w-full">Profile</h1>

                <div className="mt-2 flex flex-col md:flex-row gap-6 items-start">

                    {/* Sidebar */}
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 w-full md:w-auto">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setTabSelected("profileSettings")}
                                    className={`cursor-pointer w-full text-left p-2 rounded transition ${tabSelected === "profileSettings"
                                        ? "bg-gray-300 dark:bg-gray-700 border-l-4 border-blue-500"
                                        : "hover:bg-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    Pengaturan Profil
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setTabSelected("passwordChange")}
                                    className={`cursor-pointer w-full text-left p-2 rounded transition ${tabSelected === "passwordChange"
                                        ? "bg-gray-300 dark:bg-gray-700 border-l-4 border-blue-500"
                                        : "hover:bg-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    Ganti Password
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setTabSelected("deleteAccount")}
                                    className={`cursor-pointer w-full text-red-500 text-left p-2 rounded transition ${tabSelected === "deleteAccount"
                                        ? "bg-gray-300 dark:bg-gray-700 border-l-4 border-blue-500"
                                        : "hover:bg-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    Hapus Akun
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4 w-full">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                            {tabSelected === "profileSettings" && (
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Avatar */}
                                    <div className="flex justify-center md:justify-start">
                                        <div className="w-40 h-40 group relative">
                                            {avatarUrl ? (
                                                <Image
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    width={500}
                                                    height={500}
                                                    className="rounded-full w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-gray-500 text-sm flex items-center justify-center h-full">
                                                    Tidak ada foto
                                                </span>
                                            )}

                                            {/* Tombol Edit + Hapus */}
                                            <div className="absolute bottom-0 right-0 flex flex-col gap-2 p-1 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity">
                                                <label
                                                    htmlFor="avatarChange"
                                                    className="bg-white dark:bg-gray-700 p-1 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                                >
                                                    <FiEdit className="text-gray-700 dark:text-gray-200" size={16} />
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleUpload}
                                                    id="avatarChange"
                                                />
                                                <button
                                                    disabled={process}
                                                    type="button"
                                                    onClick={() => setAvatarUrl(null)}
                                                    className="bg-white dark:bg-gray-700 p-1 rounded shadow hover:bg-red-100 dark:hover:bg-red-500 cursor-pointer"
                                                >
                                                    <FiTrash2 className="text-red-600 dark:text-red-400" size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Data */}
                                    <form className="space-y-4 w-full" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(e) }}>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                defaultValue={data.email ?? ""}
                                                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-1">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                defaultValue={data.name}
                                                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                readOnly
                                                defaultValue={data.username}
                                                className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                                            <input
                                                type="text"
                                                name="role"
                                                id="role"
                                                value={data.role}
                                                readOnly
                                                className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="privilege" className="block text-sm font-medium mb-1">Privilege</label>
                                            <input
                                                type="number"
                                                name="privilege"
                                                id="privilege"
                                                value={data.privilege}
                                                readOnly
                                                className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                            <button disabled={process} type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                                Simpan Perubahan
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {tabSelected === "passwordChange" && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">Ganti Password</h2>
                                    <form className="space-y-4 w-full max-w-md" onSubmit={(e) => { e.preventDefault(); handleChangePassword(e) }}>
                                        <div>
                                            <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">Password Lama</label>
                                            <input
                                                type="password"
                                                id="oldPassword"
                                                name="oldPassword"
                                                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">Password Baru</label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                name="newPassword"
                                                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
                                            <input
                                                type="password"
                                                id="confirmNewPassword"
                                                name="confirmNewPassword"
                                                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <button disabled={process} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                            Ubah Password
                                        </button>
                                    </form>
                                </>
                            )}
                            {tabSelected === "deleteAccount" && (<>
                                <h2 className="text-xl font-semibold mb-4">Hapus Akun</h2>
                                <form className="space-y-4 w-full max-w-md" onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(e) }}>
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmText" className="block text-sm font-medium mb-1">Konfirmasi</label>
                                        <small className="text-red-500">Saya sangat yakin dengan penghapusan akun saya</small>
                                        <input
                                            type="text"
                                            id="confirmText"
                                            name="confirmText"
                                            className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <button disabled={process} type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                                        Hapus Akun Saya
                                    </button>
                                </form>
                            </>)}
                        </div>

                    </div>
                </div>

            </section>
        </>
    );
}
