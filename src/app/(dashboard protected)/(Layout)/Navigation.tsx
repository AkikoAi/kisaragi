"use client";

import { useState } from "react";

export default function Navigation() {
    const [dropdownOpen, setDropdownOpen] = useState<"home" | "settings" | null>(null);

    const toggleDropdown = (menu: "home" | "settings") => {
        setDropdownOpen(prev => (prev === menu ? null : menu));
    };

    return (
        <nav className="flex justify-center p-4 bg-gray-100 dark:bg-gray-800 shadow-md rounded-md space-x-8">
            <div className="relative">
                <span
                    onClick={() => toggleDropdown("home")}
                    className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                    Menu
                </span>
                <div
                    className={`absolute left-0 mt-2 w-60 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg transition-all duration-300 ${dropdownOpen !== "home" ? "hidden" : ""
                        }`}
                >
                    <ul className="p-2">
                        <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >Pengguna</li>
                        <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >Laporan </li>
                        <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >Pesan</li>
                    </ul>
                </div>
            </div>

            <div className="relative">
                <span
                    onClick={() => toggleDropdown("settings")}
                    className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                    Settings
                </span>
                <div
                    className={`absolute left-0 mt-2 w-60 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg transition-all duration-300 ${dropdownOpen !== "settings" ? "hidden" : ""
                        }`}
                >
                    <ul className="p-2">
                        <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >Akun</li>
                        <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >Pengaturan Aplikasi</li>
                        <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >Logout</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
