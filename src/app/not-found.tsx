"use client"

import { useRouter } from "next/navigation";
import { GiFox } from "react-icons/gi";

export default function NotFound() {
    const router = useRouter()
    return (
        <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-blue-200 to-purple-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex flex-col items-center justify-center text-center p-6 space-y-6">

            <div className="relative">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-2xl opacity-30 animate-ping"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>

                <GiFox size={80} className="text-orange-500 drop-shadow-lg animate-bounce" />
            </div>

            <h1 className="text-6xl font-extrabold text-gray-800 dark:text-white">404</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-md">
                Wah! Fubuki si rubah putih dan Kurokami si rubah hitam tersesat ke dimensi yang salah~
            </p>

            <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 animate-spin-slow flex items-center justify-center shadow-md">
                    <GiFox size={30} className="text-white" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 animate-pulse flex items-center justify-center shadow-md">
                    <GiFox size={30} className="text-white" />
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                Sepertinya portal ini tidak terhubung. Yuk, kembali ke beranda sebelum Fubuki ketakutan!
            </p>

            <button
                onClick={() => router.back()}
                className="cursor-pointer mt-4 px-5 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-full shadow-lg hover:scale-105 transform transition-all">
                Kembali ke Halaman Sebelumnya
            </button>
        </div>
    );
}
