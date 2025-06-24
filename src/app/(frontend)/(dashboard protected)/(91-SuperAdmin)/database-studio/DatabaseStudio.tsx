"use client";
import Modals from "@/app/(frontend)/Components/Modals";
import { useModals } from "@/app/(frontend)/Hooks/useModals";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaDatabase } from "react-icons/fa";
import { MdClose, MdOutlineSchema, MdSettings } from "react-icons/md";

type model = {
    name: string;
    documentation: string | undefined;
    fields: {
        name: string;
        type: string;
    }[];
}

export default function DatabaseStudio() {
    const [selectedModel, setSelectedModel] = useState<model | null>(null);
    const [loadingModels, setLoadingModels] = useState<boolean>(false);
    const [models, setModels] = useState<model[]>([]);

    const { modals, modalsError, modalsInfo } = useModals();

    const refreshModels = async () => {
        setLoadingModels(true);
        const res = await fetch("/api/database-studio");
        const data = await res.json();
        setLoadingModels(false);

        if (!data.status) return modalsError(data.msg);
        setModels(data.data);
        modalsInfo("Berhasil mendapatkan data");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { refreshModels(); }, []);


    return (
        <>
            <Modals status={modals} loading={loadingModels} loadingMessage="Mendapatkan data..." />
            <section className="">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaDatabase className="text-blue-500" />
                        Database Studio
                    </h1>
                    <div className="relative inline-block text-left">
                        <label
                            htmlFor="toolsDropdown"
                            tabIndex={0}
                            className="inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors focus:outline-none"
                        >
                            <BsThreeDots className="text-gray-800 dark:text-gray-200" size={20} />
                        </label>
                        <input type="checkbox" id="toolsDropdown" className="hidden peer/toolsDropdown" />
                        <div className="hidden peer-checked/toolsDropdown:block absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg transition-all animate-fade-in">
                            <ul className="py-1">
                                <li>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={refreshModels}>
                                        Segarkan
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        Tambahkan
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        Cari
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {models.map((model, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedModel(model)}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:ring-2 ring-blue-500 transition"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <MdOutlineSchema className="text-green-500" />
                                {model.name}
                            </h2>
                            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <small>
                                    {model.documentation}
                                </small>
                                <p >
                                    {model.fields.length} Fields
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedModel && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 px-4 sm:pt-28 overflow-y-auto">
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in mb-8">

                            {/* Tombol Close */}
                            <button
                                onClick={() => setSelectedModel(null)}
                                className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1 transition-colors"
                                aria-label="Tutup"
                            >
                                <MdClose size={20} />
                            </button>

                            {/* Header */}
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <MdSettings className="text-purple-500" />
                                Model Details: {selectedModel.name}
                            </h2>

                            {/* Scrollable Field List */}
                            <div className="space-y-2 text-sm">
                                {
                                    selectedModel.fields.map(({ name, type }, index) =>
                                        <div className="flex justify-between" key={index}>
                                            <span className="text-gray-600 dark:text-gray-400">{name}</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{type}</span>
                                        </div>
                                    )
                                }
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={() => setSelectedModel(null)}
                                    className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Tutup
                                </button>
                                <Link
                                    href={`/database-studio/${encodeURI(selectedModel.name)}`}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                                >
                                    Table Data
                                </Link>
                            </div>
                        </div>
                    </div>

                )}
            </section >
        </>
    );
}
