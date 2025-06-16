"use client";

import { useEffect, useState } from "react";

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
            <section className="mt-10">

                {/* Info Card */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow text-center">
                        <h2 className="font-semibold text-lg">Level</h2>
                        <p className="text-blue-500 text-xl">61 - 90</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow text-center">
                        <h2 className="font-semibold text-lg">Privilege</h2>
                        <p>Manage Users, View Logs, Limited Settings</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow text-center">
                        <h2 className="font-semibold text-lg">Status</h2>
                        <p className="text-green-500">Active</p>
                    </div>
                </div>

                {/* Menu */}
                <div className="flex justify-center space-x-4 mb-6">
                    {["users", "logs", "settings"].map((menu) => (
                        <button
                            key={menu}
                            onClick={() => setSelectedMenu(menu as "users" | "logs" | "settings")}
                            className={`px-4 py-2 rounded-md text-sm font-medium 
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
                            <h3 className="text-lg font-semibold mb-2">System Logs</h3>
                            <p>View recent activities.</p>
                            {/* Dummy Logs */}
                            <ul className="mt-2 space-y-1 text-sm">
                                {userLogs.map((value, index) => <li key={index}>{value}</li>)}
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
