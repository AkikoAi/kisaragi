"use client";
import { useState } from "react";
import { RiRefreshLine } from "react-icons/ri";

export default function Gudang() {
    const [isRefreshing, setRefreshing] = useState<Boolean>(false);

    function refreshList() {
        if (isRefreshing) return;
        setRefreshing(true);
        console.log("Refreshing list");
        setTimeout(() => {
            setRefreshing(false);
        }, 5000);
    }//

    return (<>
        <div className="fixed w-60 h-60 bg-gray-700/97 rounded-md">
        Ip
        </div>
        <div className="mt-10 flex justify-between">
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors
            cursor-pointer">
                Baru
            </button>
            <button className="flex gap-2 items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={refreshList}
                disabled={!!isRefreshing}>
                <RiRefreshLine className={isRefreshing ? "animate-spin" : ""} />
                <span>Segarkan</span>
            </button>
        </div>
        {/* Grid Card Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-7">

            <div
                className="bg-white dark:bg-gray-700 dark:text-gray-100 p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
            >
                <h3 className="font-semibold text-lg">Senjata Api</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">List | Baru | Edit</p>
            </div>
        </section>
    </>)
}