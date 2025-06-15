"use client";

import Link from "next/link";
import { useState } from "react";
import { CiBookmarkPlus, CiTrash } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { RiRefreshLine } from "react-icons/ri";

export default function Gudang() {
    const [createOnProgress, setCreateOnProgress] = useState(false);
    const [isRefreshing, setRefreshing] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");
    const [searchBoard, setSearchBoard] = useState("");
    const [list, setList] = useState<{ id: string; name: string, jumlahItem: number }[]>([
        { id: "1", name: "Buku", jumlahItem: 200 },
        { id: "2", name: "Pena", jumlahItem: 200 },
        { id: "3", name: "Laptop", jumlahItem: 200 },
        { id: "4", name: "Mouse", jumlahItem: 200 },
        { id: "5", name: "Monitor", jumlahItem: 200 },
    ]);


    function refreshList() {
        if (isRefreshing) return;
        setRefreshing(true);
        console.log("Refreshing list...");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    function searchBoardAction(e: React.FormEvent) {
        e.preventDefault()
        alert(`Kamu mencari ${searchBoard}`)
    }

    function deleteBoard(id: string) {
        if (!id) return alert("Id tidak ditemukan");
        const board = list.find(({ id: Source }) => Source == id);
        if (!board) return alert("Board tidak ditemukan pada list");
        if(confirm(`Apakah anda yakin ingin menghapus ${board.name}?`)){
            alert("item di hapus!");
            return refreshList();
        }else{
            return alert(`Operasi penghapusan ${board.name} dibatalkan, have a nice day!`)
        }
    }

    function createNewBoard(e: React.FormEvent) {
        e.preventDefault();
        if (createOnProgress) return alert("Harap tunggu permintaan sebelumnya belum selesai");
        if (!newBoardName) return alert("Nama Harus ada");
        setCreateOnProgress(true);
        fetch("/api/gudang", {
            method: "PUT",
            body: JSON.stringify({
                name: newBoardName
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(r => r.json()).then(r => {
                if (!r.status) return alert(r.msg);
                refreshList()
            })
            .catch(e => {
                alert(e);
            }).finally(() => {
                setCreateOnProgress(false)
            });

    }

    return (
        <>
            {/* Header Button Section */}
            <div className="mt-10 flex justify-between items-center flex-wrap gap-4">
                <label
                    htmlFor="NewBoard"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    <CiBookmarkPlus />
                    Baru
                </label>

                <div className="relative w-80">
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <FiSearch size={16} />
                    </div>
                    <form onSubmit={searchBoardAction}>
                        <input
                            type="text"
                            placeholder="Search here ..."
                            onChange={(e) => setSearchBoard(e.currentTarget.value)}
                            className=" w-full pl-10 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </form>
                </div>


                <button
                    onClick={refreshList}
                    disabled={isRefreshing}
                    className="flex gap-2 items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <RiRefreshLine className={isRefreshing ? "animate-spin" : ""} />
                    <span>Segarkan</span>
                </button>
            </div>

            {/* Modal Section */}
            <input type="checkbox" id="NewBoard" className="peer hidden" />
            <div className="fixed inset-0 bg-black/70 bg-opacity-40 hidden peer-checked:flex items-center justify-center z-50">
                <form className="w-[90%] md:w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4"
                    onSubmit={createNewBoard}>
                    <div>
                        <label htmlFor="NewBoard-name" className="block mb-1 font-medium">
                            Nama Board
                        </label>
                        <small className="text-red-600">
                            *Tidak dapat menambahkan nama yang sudah ada
                        </small>
                        <input
                            id="NewBoard-name"
                            type="text"
                            onChange={(r) => setNewBoardName(r.currentTarget.value)}
                            placeholder="Masukkan nama board baru"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-between gap-2">
                        <label
                            htmlFor="NewBoard"
                            className="cursor-pointer w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-center"
                        >
                            Close
                        </label>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>

            {/* List Display Section */}
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-7 w-full">
                {list.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow flex flex-col"
                    >
                        <div className="p-4 flex flex-col flex-grow">
                            <h1 className="font-semibold text-lg mb-2">{item.name}</h1>
                            <small className="font-semibold mt-1">{item.jumlahItem} Item</small>
                            <div className="grid grid-cols-4 gap-3">
                                <Link className="text-center col-span-3 cursor-pointer mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    href={`/gudang/${item.id}/item`}>
                                    Daftar Item
                                </Link>
                                <button className="min-w-10 flex items-center justify-center cursor-pointer mt-4 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    onClick={() => deleteBoard(`${item.id}`)}>
                                    <CiTrash size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}
