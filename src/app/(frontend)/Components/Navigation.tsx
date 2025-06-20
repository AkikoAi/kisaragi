"use client";

import { DataAccessLayer, verifyToken } from "@/utils/ksr_jwt";
import Image from "next/image";
import Link from "next/link";
import { Fragment, InputEvent, InputHTMLAttributes, ReactElement, useEffect, useState } from "react";
import { BiLogOut, BiX } from "react-icons/bi";
import { CgEnter } from "react-icons/cg";
import { FaBars, FaCog, FaCrown, FaIdBadge, FaLock, FaStar, FaUserTie } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

import { GiFox, GiFoxTail } from "react-icons/gi";
import { MdWarning } from "react-icons/md";

type menuType = {
    name: string;
    path: string | null;
    prefetch: boolean;
}

function ProfilePicture({ data }: { data: DataAccessLayer }) {
    return <div className="relative flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">

        <Image
            width={400}
            height={400}
            src={data.avatarUrl || "/images/defaultAvatar.png"}
            alt={`Foto profil ${data.name}`}
            className="w-10 h-10 rounded-full"
        />
    </div>
}

export default function Navigation({ data, menu }: { menu: menuType[], data: DataAccessLayer }) {
    const [filteredMenu, setFilteredMenu] = useState<menuType[]>(menu);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key.toLowerCase() === 'k') {
                event.preventDefault();

                // Ambil element checkbox
                const checkbox = document.getElementById("menuViewModals") as HTMLInputElement | null;
                if (checkbox) {
                    checkbox.checked = !checkbox.checked; // toggle
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function searchAction(searchInput: string) {
        if (!searchInput) {
            setFilteredMenu(menu);
            return
        };
        const filteringResult = menu.filter(({ name }) => {
            if (name.toLowerCase().includes(searchInput.toLowerCase())) return true;
            return false
        });
        setFilteredMenu(filteringResult);
    }

    function logoutAction() {
        if (confirm("Konfirmasi ingin keluar?")) {
            alert("Semoga harimu menyenangkan!");
            return window.location.href = "/api/logout";
        }
        alert("Selamat bekerja kembali!");
    }

    return (
        <nav className="w-full bg-gray-100 dark:bg-gray-800 shadow-md p-4 fixed h-16 z-50">
            {/* Universal Navigation */}
            <div className="flex justify-between items-center h-8">
                <div>
                    <label
                        htmlFor="menuViewModals"
                        className="cursor-pointer">
                        <FaBars />
                    </label>
                </div>
                <div>
                    <label
                        htmlFor="profileDropdown"
                        className="cursor-pointer flex gap-3">
                        <ProfilePicture data={data} />
                        <div className="text-sm text-gray-700 dark:text-gray-200">
                            <p>{data.name}</p>
                            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">{data.role} {data.privilege >= 91 ? <FaCrown /> : data.privilege >= 61 ? <FaStar /> : data.privilege >= 31 ? <FaIdBadge /> : <FaLock />}</p>
                        </div>
                    </label>
                </div>
            </div>
            <div>
                <input type="checkbox" id="menuViewModals" className="hidden peer" />
                <div className="hidden peer-checked:block fixed inset-0 bg-black/90">
                    <div className="flex flex-col p-4">
                        <label htmlFor="menuViewModals"
                            className="cursor-pointer text-3xl">
                            <BiX />
                        </label>
                        <div className="mx-auto mt-4 not-md:max-w-[99%] w-[37rem] flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl">
                            <div className="w-full max-w-[37rem] bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
                                {/* Search Menu */}
                                <div>
                                    <div className="relative flex items-center">
                                        <button className="absolute right-3 inset-y-0 text-gray-400"><FiSearch /></button>
                                        <input type="text" placeholder="Cari ..." className="w-full pr-8 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
                                            onChange={(e) => searchAction(e.currentTarget.value)} />
                                    </div>
                                </div>
                                <div className="mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-gray-200">
                                    <ul className="p-2 max-h-80 overflow-y-auto">
                                        {
                                            filteredMenu.length > 0 ? filteredMenu.map(({ name, path, prefetch }, index, arr) =>
                                                <Fragment key={index}>
                                                    {prefetch ? <Link href={path || "#"} >
                                                        <li className="flex items-center gap-2 my-2 py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                                            <GiFoxTail />
                                                            {name}
                                                        </li>
                                                    </Link>
                                                        : <a href={path || "#"}>
                                                            <li className="flex items-center gap-2 my-2 py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                                                <GiFoxTail />
                                                                {name}
                                                            </li>
                                                        </a>
                                                    }
                                                    {index + 1 != arr.length && <hr />}
                                                </Fragment>
                                            ) :
                                                <li className="flex items-center gap-2 py-3 px-2">
                                                    <MdWarning />
                                                    Tidak ada hasil yang ditemukan
                                                </li>
                                        }
                                    </ul >
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div>
                <input type="checkbox" id="profileDropdown" className="hidden peer" />
                <div className="hidden peer-checked:block absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-40 dark:text-gray-200">
                    <ul className="p-2">
                        <Link href="/profile">
                            <li className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                <FaUserTie />
                                Profile</li>
                        </Link>
                        <hr />
                        <li className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                            <FaCog />Setting</li>
                        <hr />
                        <li className="flex items-center gap-2 py-1 px-2 text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={logoutAction}
                        >
                            <BiLogOut />Logout
                        </li>
                    </ul>
                </div>
            </div>

            {/* Desktop Navigation */}

            {/* Mobile Navigation */}


            {/* Mobile Menu Dropdown */}

        </nav >
    );
}
