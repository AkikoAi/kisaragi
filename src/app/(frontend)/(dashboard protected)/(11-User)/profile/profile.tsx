"use client";

import type { DataAccessLayer } from "@/utils/ksr_jwt";
import Image from "next/image";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function Profile({ data }: { data: DataAccessLayer }) {
    return (<>
        <h1 className="text-2xl font-bold text-center md:text-left w-full">Pengaturan</h1>
        <section className="mt-10 px-4 gap-6 flex">
            <div>
                {/* Sidebar Menu */}
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 w-60">
                    <ul className="space-y-2">
                        <li>
                            <label htmlFor="profileSettings" className="cursor-pointer block p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                                Pengaturan Profil
                            </label>
                        </li>
                        <li>
                            <label htmlFor="passwordChange" className="cursor-pointer block p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                                Ganti Password
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Profile Settings */}
            <div className="flex-1 space-y-4">
                <div>
                    <input type="radio" name="settingTabs" id="profileSettings" className="peer hidden" defaultChecked />
                    <div className="hidden peer-checked:block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row gap-8">

                            {/* Avatar */}
                            <div className="flex justify-center md:justify-start">
                                <div className="relative w-40 h-40 overflow-hidden bg-gray-200 dark:bg-gray-700 group rounded-full">
                                    {data.avatarUrl ? (
                                        <Image
                                            src={data.avatarUrl}
                                            alt="Avatar"
                                            width={160}
                                            height={160}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm flex items-center justify-center h-full">Tidak ada foto</span>
                                    )}

                                    {/* Tombol Edit + Hapus */}
                                    <div className="absolute top-0 right-0 flex flex-col gap-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label htmlFor="avatarChange" className="bg-white dark:bg-gray-800 p-1 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <FiEdit className="text-gray-700 dark:text-gray-200" size={16} />
                                        </label>
                                        <input type="file" accept="image/*" className="hidden" name="avatar" id="avatarChange" />
                                        <button type="button" className="bg-white dark:bg-gray-800 p-1 rounded shadow hover:bg-red-100 dark:hover:bg-red-700 cursor-pointer">
                                            <FiTrash2 className="text-red-600 dark:text-red-400" size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Form Data */}
                            <form className="space-y-4 w-full">
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
                                        defaultValue={data.username}
                                        className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                                    <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                        Simpan Perubahan
                                    </button>
                                    <button type="button" className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                                        Hapus Akun
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Password Change Tab */}
                <div>
                    <input type="radio" name="settingTabs" id="passwordChange" className="peer hidden" />
                    <div className="hidden peer-checked:block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Ganti Password</h2>
                        <form className="space-y-4 w-full max-w-md">
                            <div>
                                <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">Password Lama</label>
                                <input type="password" id="oldPassword" name="oldPassword" className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">Password Baru</label>
                                <input type="password" id="newPassword" name="newPassword" className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Ubah Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </>
    );
}
