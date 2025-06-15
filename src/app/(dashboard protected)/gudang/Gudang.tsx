import { useState } from "react";
import { RiRefreshLine } from "react-icons/ri";

export default function Gudang() {
    const [isRefreshing, setRefreshing] = useState<Boolean>(false);

    function refreshList() {
        if (isRefreshing) return;
        console.log("Refreshing list");
    }

    return (<>
        {/* Grid Card Section */}
        <div className="mt-10 flex justify-end">
            <button
                onClick={refreshList}>
                <RiRefreshLine />
            </button>
        </div>
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