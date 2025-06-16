"use client";

import { useRouter } from "next/navigation";
import { GiFox } from "react-icons/gi";

export default function ServerError() {
    const router = useRouter();

    return (
        <>
            <GiFox size={80} className="text-red-500 dark:text-red-400 mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold mb-2">Waaah~ Shirakami Fubuki Lagi Minum Teh!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Sepertinya server sedang beristirahat di teras sambil menyeruput teh hijau... atau mungkin Kurokami Fubuki lagi usil!
                Cobalah beberapa saat lagi ya~ 🦊🍵
            </p>
            <button
                onClick={() => router.refresh()}
                className="cursor-pointer mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
                Coba Muat Ulang
            </button>
        </>
    );
}
