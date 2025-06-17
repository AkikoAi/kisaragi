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

type action = "edit" | "delete" | "enable" | "disable" | "restore" | null;

export default function ManagementUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalAction, setModalAction] = useState<action>(null);
    const [onAction, setOnAction] = useState<boolean>(false);

    const fetchUsers = async (username?: string) => {
        try {
            setLoading(true);
            setError(null);
            // Placeholder fetch
            const requestPath = new URL("/api/management-users", window.location.origin);
            requestPath.searchParams.set("page", "1");
            requestPath.searchParams.set("limit", "100");
            if (searchTerm.length >= 3) requestPath.searchParams.set("username", searchTerm);
            else if (username && username.length >= 3) requestPath.searchParams.set("username", username);
            fetch(requestPath.toString(), {
                method: "GET"
            })
                .then(r => r.json())
                .then(r => {
                    if (r.status) return setUsers(r.data);
                    alert(r.msg); // kamu bisa ganti pakai toast misalnya
                })
        } catch (e) {
            setError("Gagal memuat data pengguna.");
        } finally {
            setLoading(false);
        }
    };

    function doSearch(e: React.FormEvent) {
        e.preventDefault();
        fetchUsers();
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = (user: User, action: action) => {
        setSelectedUser(user);
        setModalAction(action);
        setIsModalOpen(true);
    };

    const confirmAction = () => {
        console.log(`Action: ${modalAction} untuk user ${selectedUser?.username}`);
        setIsModalOpen(false);
        if (onAction) return alert("Harap tunggu aksi sebelumnya selesai!");
        if (!selectedUser) return alert("User not selected!");
        setOnAction(true)
        if (modalAction == "disable") {
            fetch("/api/management-users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...selectedUser, username: selectedUser.username, isVerified: false })
            }).then(r => r.json()).then(r => {
                if (!r.status) return alert(r.msg);
                return alert("Aksi berhasil")
            }).catch(e => {
                return alert("Gagal mengirim perintah aksi ke server");
            }).finally(() => {
                fetchUsers(selectedUser.username);
                setOnAction(false);
            });
        } else if (modalAction == "enable") {
            fetch("/api/management-users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...selectedUser, username: selectedUser.username, isVerified: true })
            }).then(r => r.json()).then(r => {
                if (!r.status) return alert(r.msg);
                return alert("Aksi berhasil")
            }).catch(e => {
                return alert("Gagal mengirim perintah aksi ke server");
            }).finally(() => {
                fetchUsers(selectedUser.username);
                setOnAction(false);
            });
        } else if (modalAction == "delete" || modalAction == "restore") {
            fetch("/api/management-users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: selectedUser.username, action: modalAction })
            }).then(r => r.json()).then(r => {
                if (!r.status) return alert(r.msg);
                return alert("Aksi berhasil")
            }).catch(e => {
                return alert("Gagal mengirim perintah aksi ke server");
            }).finally(() => {
                fetchUsers(selectedUser.username);
                setOnAction(false);
            });
        } else {
            setOnAction(false);
            return alert("Aksi tidak dikenali");
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="mt-10 px-4">
            <h2 className="text-2xl font-semibold mb-4">Manajemen Pengguna</h2>
            <div className="flex justify-between items-center">

                <form onSubmit={doSearch}>
                    <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border rounded w-full max-w-sm"
                    />
                </form>
                <button
                    className="flex gap-2 items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                    onClick={() => fetchUsers()}
                    disabled={loading}
                >
                    <RiRefreshLine className={loading ? "animate-spin" : ""} />
                    <span>Segarkan</span>
                </button>
            </div>
            {loading && <p>Memuat data...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700">
                                <th className="py-2 px-4">Username</th>
                                <th className="py-2 px-4">Nama</th>
                                <th className="py-2 px-4">Privilege</th>
                                <th className="py-2 px-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index, arr) => (
                                <tr key={index} className={index + 1 != arr.length ? "border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700" : ""}>
                                    <td className="py-2 px-4">{user.username}</td>
                                    <td className="py-2 px-4">{user.name}</td>
                                    <td className="py-2 px-4">{user.privilege}</td>
                                    <td className="py-2 px-4 text-center space-x-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <button onClick={() => handleAction(user, "edit")} className="text-blue-500 hover:underline cursor-pointer"><FaEdit className="md:hidden" /><span className="not-md:hidden">Edit</span></button>
                                            {user.isDeleted ?
                                                <button onClick={() => handleAction(user, "restore")} className="text-lime-500 hover:underline cursor-pointer"><FaUndo className="md:hidden" /><span className="not-md:hidden">Restore</span></button> :
                                                <button onClick={() => handleAction(user, "delete")} className="text-red-500 hover:underline cursor-pointer"><FaTrash className="md:hidden" /><span className="not-md:hidden">Hapus</span></button>
                                            }
                                            {user.isVerified ?
                                                <button onClick={() => handleAction(user, "disable")} className="text-yellow-500 hover:underline cursor-pointer"><FaTimes className="md:hidden" /><span className="not-md:hidden">Non Aktifkan</span></button> :
                                                <button onClick={() => handleAction(user, "enable")} className="text-green-500 hover:underline cursor-pointer"><FaCheck className="md:hidden" /><span className="not-md:hidden">Aktifkan</span></button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }

            {
                isModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
                            <h3 className="text-lg font-semibold mb-4">Konfirmasi Aksi</h3>
                            <p>Apakah Anda yakin ingin <span className="font-bold">{modalAction}</span> pengguna <span className="font-bold">{selectedUser.username}</span>?</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded text-gray-700 cursor-pointer">Batal</button>
                                <button onClick={confirmAction} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">Konfirmasi</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
}
