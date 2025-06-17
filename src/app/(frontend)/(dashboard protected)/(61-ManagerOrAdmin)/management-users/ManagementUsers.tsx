"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes, FaTrash, FaUndo } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";

// User Type
type User = {
    email: string | null;
    password: string;
    id: string;
    username: string;
    name: string;
    limit: number;
    role: string;
    privilege: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
};

type Action = "edit" | "delete" | "enable" | "disable" | "restore" | null;

export default function ManagementUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<Action>(null);
    const [onAction, setOnAction] = useState(false);

    const fetchUsers = async (username?: string) => {
        try {
            setLoading(true);
            setError(null);
            const requestPath = new URL("/api/management-users", window.location.origin);
            requestPath.searchParams.set("page", "1");
            requestPath.searchParams.set("limit", "100");
            const query = username ?? searchTerm;
            if (query.length >= 3) requestPath.searchParams.set("username", query);

            const res = await fetch(requestPath.toString());
            const data = await res.json();
            if (data.status) setUsers(data.data);
            else alert(data.msg);
        } catch {
            setError("Gagal memuat data pengguna.");
        } finally {
            setLoading(false);
        }
    };

    const doSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAction = (user: User, action: Action) => {
        setSelectedUser(user);
        setModalAction(action);
        setIsModalOpen(true);
    };

    const confirmAction = async (manualUser?: User) => {
        if (onAction) return alert("Harap tunggu aksi sebelumnya selesai!");
        if (!selectedUser || !selectedUser && !manualUser) return alert("User not selected!");

        setOnAction(true);
        try {
            let method = "POST";
            let body: any = { ...(manualUser || selectedUser), username: selectedUser.username };

            if (modalAction === "disable") body.isVerified = false;
            else if (modalAction === "enable") body.isVerified = true;
            else if (modalAction === "delete" || modalAction === "restore") {
                method = "DELETE";
                body = { username: selectedUser.username, action: modalAction };
            } else if (modalAction === "edit") {
                if (!confirm("Periksa kembali data sebelum mengonfirmasi perubahan")) {
                    return;
                }
                console.log(selectedUser, "ACTION");
            } else {
                throw new Error("Aksi tidak dikenali");
            }

            const res = await fetch("/api/management-users", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const result = await res.json();
            if (!result.status) return alert(result.msg);
            alert("Aksi berhasil");
            fetchUsers(body?.newUsername || selectedUser.username);
        } catch {
            alert("Gagal mengirim perintah aksi ke server");
        } finally {
            setIsModalOpen(false);
            setOnAction(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="mt-10 px-4">
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
                <div className="overflow-x-auto max-w-[99%] shadow rounded-lg">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700">
                                <th className="py-2 px-4">Username</th>
                                <th className="py-2 px-4">Nama</th>
                                <th className="py-2 px-4">Role</th>
                                <th className="py-2 px-4">Level Hak</th>
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
                                    <td className="py-2 px-4 text-center">{user.role}</td>
                                    <td className="py-2 px-4 text-center">{user.privilege}</td>
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
            )}



            {isModalOpen && selectedUser && modalAction === "edit" && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Edit User: {selectedUser.username}</h3>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const data = Object.assign({}, selectedUser, Object.fromEntries(formData), { privilege: Number(formData.get("privilege")), email: formData.get("email") || undefined, newUsername: (selectedUser.username !== formData.get('username') ? formData.get('username') || undefined : undefined) });
                            confirmAction(data);
                        }}>
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
