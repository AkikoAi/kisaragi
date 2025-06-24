"use client";

import { useRouter } from "next/navigation";
import { GiFox } from "react-icons/gi";
import { IoMdWarning } from "react-icons/io";
import React from "react";

export default function Unauthorized() {
    const router = useRouter();

    return (
        <>
            <GiFox size={64} className="text-orange-400 dark:text-orange-300 mb-4 animate-bounce" />
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">Oops! Ekor Fubuki Tidak Mengizinkan <IoMdWarning className="not-md:hidden"/></h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Sepertinya kamu mencoba masuk ke area rahasia yang hanya bisa diakses oleh Fubuki atau ekor yang lebih tinggi.
                Tenang saja... tidak semua ekor bisa menjelajah ke sana. Mungkin kamu butuh izin dari Kurokami?
            </p>
            <button
                onClick={() => router.back()}
                className="cursor-pointer mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Kembali ke Halaman Sebelumnya
            </button>
        </>
    );
}
