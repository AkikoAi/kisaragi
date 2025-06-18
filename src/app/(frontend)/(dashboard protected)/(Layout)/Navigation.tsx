"use client";

import { verifyToken } from "@/utils/ksr_jwt";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCrown, FaIdBadge, FaLock, FaRegStar, FaStar } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { GiFox } from "react-icons/gi";


function ProfilePicture({ data }: { data: verifyToken }) {
    console.log("Menambahkan profile picture")
    return <div
        className="relative flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {data.avatarUrl ? (
            <Image
                width={400}
                height={400}
                src={data.avatarUrl}
                alt={"String"}
                className="w-10 h-10 rounded-full"
            />
        ) : (
            <GiFox className="w-10 h-10 text-orange-500" />
        )}
    </div>
}

export default function Navigation({ data }: { data: verifyToken }) {
    const [dropdownOpen, setDropdownOpen] = useState<"home" | "settings" | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleDropdown = (menu: "home" | "settings") => {
        setDropdownOpen((prev) => (prev === menu ? null : menu));
    };

    return (
        <nav className="w-full bg-gray-100 dark:bg-gray-800 shadow-md p-4 rounded-md">
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-between items-center">
                <div className="flex space-x-8 items-center">
                    <div className="relative">
                        <span
                            onClick={() => toggleDropdown("home")}
                            className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            Menu
                        </span>
                        {dropdownOpen === "home" && (
                            <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 dark:text-gray-200">
                                <ul className="p-2">
                                    <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"><Link href="/management-users">Pengguna</Link></li>
                                    <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Laporan</li>
                                    <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Pesan</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <span
                            onClick={() => toggleDropdown("settings")}
                            className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            Settings
                        </span>
                        {dropdownOpen === "settings" && (
                            <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 dark:text-gray-200">
                                <ul className="p-2">
                                    <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Akun</li>
                                    <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Pengaturan Aplikasi</li>
                                    <li className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4">

                    <ProfilePicture data={data} />

                    <div className="text-sm text-gray-700 dark:text-gray-200">
                        <p>{data.name}</p>
                        <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">{data.role} {data.privilege >= 91 ? <FaCrown /> : data.privilege >= 61 ? <FaStar /> : data.privilege >= 31 ? <FaIdBadge /> : <FaLock />}</p>
                    </div>

                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex justify-between items-center">
                <div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-700 dark:text-gray-200"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4">

                    <ProfilePicture data={data} />

                    <div className="text-sm text-gray-700 dark:text-gray-200 text-right">
                        <p>{data.name}</p>
                        <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">{data.role} {data.privilege >= 91 ? <FaCrown /> : data.privilege >= 61 ? <FaStar /> : data.privilege >= 31 ? <FaIdBadge /> : <FaLock />}</p>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 space-y-2 bg-white dark:bg-gray-700 border rounded-md p-4 text-gray-700 dark:text-gray-200">
                    <div>
                        <p className="font-semibold">Menu</p>
                        <ul className="mt-1 space-y-1">
                            <li className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">Pengguna</li>
                            <li className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">Laporan</li>
                            <li className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">Pesan</li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold">Settings</p>
                        <ul className="mt-1 space-y-1">
                            <li className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">Akun</li>
                            <li className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">Pengaturan Aplikasi</li>
                            <li className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">Logout</li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
}
