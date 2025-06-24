"use client";

import React, { useEffect, useState, FormEvent, useCallback } from "react";
import { FaCheck, FaEdit, FaTimes, FaTrash, FaUndo } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";
import Pagination from "../../../Components/Pagination";
import { useModals } from "@/app/(frontend)/Hooks/useModals";
import Modals from "@/app/(frontend)/Components/Modals";

// User Type
type User = {
    id: string;
    username: string;
    email: string | null;
    password: string;
    name: string;
    role: string;
    privilege: number;
    limit: number;
    isVerified: boolean;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    newUsername?: string;
};

type UserPost = Omit<User, 'email'> & { email: string };

type Action = "edit" | "delete" | "enable" | "disable" | "restore" | null;

type ApiResponse = {
    status: boolean;
    msg: string | { message: string }[];
    data?: {
        users: User[];
        count: number;
    };
};

export default function ManagementUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalAction, setModalAction] = useState<Action>(null);
    const [onAction, setOnAction] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { modals, modalsWarning, modalsError, modalsSuccess } = useModals();

    const fetchUsers = useCallback(async (username?: string): Promise<void> => {
        try {
            setError(null);
            const requestPath = new URL("/api/management-users", window.location.origin);
            requestPath.searchParams.set("page", page.toString());
            requestPath.searchParams.set("limit", "100");
            const query = username ?? searchTerm;
            if (query.length >= 3) requestPath.searchParams.set("username", query);

            setLoading(true);
            const res = await fetch(requestPath.toString());
            const data: ApiResponse = await res.json();
            setLoading(false);

            if (data.status && data.data) {
                setUsers(data.data.users);
                setTotalPages(Math.ceil(data.data.count / 100));
            } else {
                modalsWarning(typeof data.msg === "string" ? data.msg : data.msg[0]?.message || "Terjadi kesalahan.");
            }
        } catch {
            setError("Gagal memuat data pengguna.");
        }
    }, [page, searchTerm, modalsWarning]);

    const doSearch = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        fetchUsers();
    };

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleAction = (user: User, action: Action): void => {
        setSelectedUser(user);
        setModalAction(action);
        setIsModalOpen(true);
    };

    const confirmAction = async (manualUser?: User): Promise<void> => {
        if (onAction) return modalsWarning("Harap tunggu aksi sebelumnya selesai!");
        if (!selectedUser && !manualUser) return modalsWarning("User not selected!");

        try {
            let method: "POST" | "DELETE" = "POST";
            let body: Partial<UserPost> | { username: string; action: "restore" | "delete" } | User = manualUser || selectedUser!;
            const baseUser = manualUser || selectedUser!;

            body = {
                ...baseUser,
                username: baseUser.username,
                email: baseUser.email || undefined
            };

            if (modalAction === "disable") body.isVerified = false;
            else if (modalAction === "enable") body.isVerified = true;
            else if (modalAction === "delete" || modalAction === "restore") {
                method = "DELETE";
                body = { username: baseUser.username, action: modalAction };
            } else if (modalAction === "edit") {
                if (!confirm("Periksa kembali data sebelum mengonfirmasi perubahan")) return;
            } else {
                return modalsError("Aksi Tidak dikenali");
            }

            setOnAction(true);
            const res = await fetch("/api/management-users", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const result: ApiResponse = await res.json();
            setOnAction(false);
            setIsModalOpen(false);

            if (!result.status) return modalsWarning(typeof result.msg === "string" ? result.msg : result.msg[0]?.message || "Error");
            modalsSuccess("Aksi berhasil");
            fetchUsers(baseUser.newUsername || baseUser.username);
        } catch {
            modalsError("Gagal mengirim perintah aksi ke server");
        }
    };

    const filteredUsers = users.slice(0, 10).filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    /*
        const handleEditForm = (e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            if (!selectedUser) return;
    
            const formData = new FormData(e.currentTarget);
            const updatedUser: User = {
                ...selectedUser,
                avatarUrl: (formData.get("avatarUrl") as string) || null,
                username: formData.get("username") as string,
                name: formData.get("name") as string,
                email: (formData.get("email") as string) || null,
                role: formData.get("role") as string,
                privilege: Number(formData.get("privilege")),
                newUsername: selectedUser.username !== formData.get("username") ? (formData.get("username") as string) : undefined,
            };
    
            confirmAction(updatedUser);
        };*/

    return (
        <section >
            <Modals status={modals} loading={loading} />

            <h2 className="text-2xl font-semibold mb-4">Manajemen Pengguna</h2>
            <div className="flex justify-between items-center mb-4">
                <form onSubmit={doSearch}>
                    <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded w-full max-w-sm"
                    />
                </form>
                <button
                    onClick={() => fetchUsers()}
                    disabled={loading}
                    className="inset-y-0 flex gap-2 items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <RiRefreshLine className={loading ? "animate-spin" : ""} />
                    Segarkan
                </button>
            </div>

            {loading && <p>Memuat data...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="overflow-x-auto max-w-[99%] shadow rounded-lg">
                        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-700">
                                    <th className="py-2 px-4">Username</th>
                                    <th className="py-2 px-4">Nama</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Role</th>
                                    <th className="py-2 px-4">Level Hak</th>
                                    <th className="py-2 px-4">Avatar</th>
                                    <th className="py-2 px-4">Diverifikasi</th>
                                    <th className="py-2 px-4">Dihapus</th>
                                    <th className="py-2 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index, arr) => (
                                    <tr key={index} className={`${index + 1 != arr.length ? "border-b dark:border-gray-600 " : ""}hover:bg-gray-50 dark:hover:bg-gray-700`}>
                                        <td className="py-2 px-4">{user.username}</td>
                                        <td className="py-2 px-4">{user.name}</td>
                                        <td className="py-2 px-4">{user.email}</td>
                                        <td className="py-2 px-4 text-center">{user.role}</td>
                                        <td className="py-2 px-4 text-center">{user.privilege}</td>
                                        <td className="py-2 px-4">{user.avatarUrl ? <FaCheck className="text-green-500 mx-auto" /> : <FaTimes className="text-red-500 mx-auto" />}</td>
                                        <td className="py-2 px-4">{user.isVerified ? <FaCheck className="text-green-500 mx-auto" /> : <FaTimes className="text-red-500 mx-auto" />}</td>
                                        <td className="py-2 px-4">{user.isDeleted ? <FaCheck className="text-red-500 mx-auto" /> : <FaTimes className="text-green-500 mx-auto" />}</td>
                                        <td className="py-2 px-8 md:px-4 text-center">
                                            <div className="grid grid-cols-3 gap-8 md:gap-4">
                                                <button onClick={() => handleAction(user, "edit")} className="text-blue-500 cursor-pointer"><FaEdit /></button>
                                                {user.isDeleted ? (
                                                    <button onClick={() => handleAction(user, "restore")} className="text-lime-500 cursor-pointer"><FaUndo /></button>
                                                ) : (
                                                    <button onClick={() => handleAction(user, "delete")} className="text-red-500 cursor-pointer"><FaTrash /></button>
                                                )}
                                                {user.isVerified ? (
                                                    <button onClick={() => handleAction(user, "disable")} className="text-yellow-500 cursor-pointer"><FaTimes /></button>
                                                ) : (
                                                    <button onClick={() => handleAction(user, "enable")} className="text-green-500 cursor-pointer"><FaCheck /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </>)}



            {isModalOpen && selectedUser && modalAction === "edit" && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Edit User: {selectedUser.username}</h3>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            console.log(formData)
                            const data = Object.assign({}, selectedUser, Object.fromEntries(formData), {
                                privilege: Number(formData.get("privilege")),
                                email: formData.get("email") || null,
                                newUsername: (selectedUser.username !== formData.get('username') ? formData.get('username') || undefined : undefined),
                                avatarUrl: formData.get("avatarUrl") || null
                            });
                            confirmAction(data);
                        }}>
                            <div>
                                <label className="block mb-1 text-sm">Avatar Url</label>
                                <input
                                    type="text"
                                    name="avatarUrl"
                                    defaultValue={selectedUser.avatarUrl || ""}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    defaultValue={selectedUser.username}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedUser.name}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={selectedUser.email || ""}
                                    className="w-full p-2 border rounded"

                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    defaultValue={selectedUser.role}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Privilege</label>
                                <input
                                    type="number"
                                    name="privilege"
                                    defaultValue={selectedUser.privilege}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded text-gray-700 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"

                                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }

            {
                isModalOpen && selectedUser && modalAction !== "edit" && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
                            <h3 className="text-lg font-semibold mb-4">Konfirmasi Aksi</h3>
                            <p>Apakah Anda yakin ingin <b>{modalAction}</b> pengguna <b>{selectedUser.username}</b>?</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded cursor-pointer text-gray-700 ">Batal</button>
                                <button onClick={() => confirmAction()} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer ">Konfirmasi</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
}
