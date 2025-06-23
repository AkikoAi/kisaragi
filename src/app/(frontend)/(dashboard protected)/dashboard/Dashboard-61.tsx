"use client";

import { useEffect, useState } from "react";
import { RiRefreshLine } from "react-icons/ri";

export default function AdminPage() {
    const [selectedMenu, setSelectedMenu] = useState<"users" | "logs" | "settings">("users");
    const [loadingUserLogs, setLoadingUserLogs] = useState<Boolean>(false);
    const [userLogs, setUserLogs] = useState<string[]>([]);

    function getUserLogs() {
        if (loadingUserLogs) return;
        setLoadingUserLogs(true);
        fetch("/api/user-logs").then(r => r.json()).then(r => {
            if (r.status) {
                const data = r.data.reverse();
                return setUserLogs(data);
            }
            return alert(r.msg);
        }).catch(e => {
            return alert("Gagal mengambil data user logs");
        }).finally(() => {
            setLoadingUserLogs(false);
        });
    }

    useEffect(() => {
        getUserLogs();
    }, [])

    return (
        <>
            <section>

                {/* Menu */}
                <div className="flex justify-center space-x-4 mb-6">
                    {["users", "logs", "settings"].map((menu) => (
                        <button
                            key={menu}
                            onClick={() => setSelectedMenu(menu as "users" | "logs" | "settings")}
                            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer
                        ${selectedMenu === menu
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"} 
                        hover:bg-blue-500 hover:text-white transition-colors`}
                        >
                            {menu.charAt(0).toUpperCase() + menu.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-4 bg-white dark:bg-gray-700 rounded-md shadow min-h-[200px]">
                    {selectedMenu === "users" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">User Management</h3>
                            <p>View, promote, or disable users here.</p>
                            {/* Dummy Content */}
                            <ul className="mt-2 space-y-1">
                                <li className="p-2 bg-gray-100 dark:bg-gray-600 rounded">User A (Active)</li>
                                <li className="p-2 bg-gray-100 dark:bg-gray-600 rounded">User B (Disabled)</li>
                            </ul>
                        </div>
                    )}
                    {selectedMenu === "logs" && (
                        <div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 inset-y-0">System Logs</h3>
                                    <small className="italic">
                                        View recent activities.</small>
                                </div>
                                <button
                                    className="flex gap-2 items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                                    disabled={!!loadingUserLogs}
                                    onClick={getUserLogs}
                                >
                                    <RiRefreshLine className={loadingUserLogs ? "animate-spin" : ""} />
                                    <span>Segarkan</span>
                                </button>
                            </div>
                            <hr className="my-4 border-gray-300 dark:border-gray-600" />
                            {/* Dummy Logs */}
                            <ul className="mt-2 space-y-1 text-sm overflow-y-auto max-h-40">
                                {loadingUserLogs ? "Loading logs user..." : userLogs.map((value, index) => <li key={index}>{value}</li>)}
                            </ul>
                        </div>
                    )}
                    {selectedMenu === "settings" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Admin Settings</h3>
                            <p>Adjust admin-specific settings (limited).</p>
                            {/* Dummy Settings */}
                            <div className="mt-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="w-4 h-4" />
                                    Enable Email Notifications
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </section></>);
}
