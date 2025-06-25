"use client";
import  { ReactNode } from "react";
import { MdInfo, MdCheckCircle, MdError, MdWarning, MdBugReport } from "react-icons/md";
import { ModalType } from "../Hooks/useModals";

type ModalsProps = {
    status: { show: boolean; type: ModalType; message: string | null };
    loading: boolean; // process state dari parent
    loadingMessage?: string;
};

const typeStyles: Record<ModalType, { bg: string; icon: ReactNode; message: string }> = {
    info: { bg: "bg-blue-500 border-blue-700", icon: <MdInfo />, message: "Information" },
    success: { bg: "bg-green-500 border-green-700", icon: <MdCheckCircle />, message: "Berhasil" },
    error: { bg: "bg-red-500 border-red-700", icon: <MdError />, message: "Error" },
    warning: { bg: "bg-yellow-500 border-yellow-700 text-black", icon: <MdWarning />, message: "Peringatan" },
    debug: { bg: "bg-purple-500 border-purple-700", icon: <MdBugReport />, message: "Debug" },
    process: { bg: "bg-gray-800 border-cyan-800", icon: <MdInfo />, message: "Memproses" },
};

export default function Modals({ status, loading, loadingMessage }: ModalsProps) {
    // Jika loading, selalu tampilkan "process"
    if (loading) {
        const { bg, icon, message: messageDefault } = typeStyles['process'];
        return (
            <div className={`z-40 fixed top-20 left-1/2 -translate-x-1/2 text-white text-sm px-4 py-2 rounded shadow border ${bg} flex items-center gap-2`}>
                {icon}
                <span>{loadingMessage || messageDefault}</span>
            </div>
        );
    }

    // Jika bukan loading dan show true, tampilkan sesuai type
    if (!status.show) return null;

    const { bg, icon, message: messageDefault } = typeStyles[status.type];

    return (
        <div className={`z-40 fixed top-20 left-1/2 -translate-x-1/2 text-white text-sm px-4 py-2 rounded shadow border ${bg} flex items-center gap-2`}>
            {icon}
            <span>{status.message || messageDefault}</span>
        </div>
    );
}
