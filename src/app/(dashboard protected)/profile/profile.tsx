"use client";

import { verifyToken } from "@/utils/ksr_jwt";

export default function Profile({ User }: { User: verifyToken }) {
    return (<>
        <div id="card" className="bg-white text-black dark:bg-gray-600 dark:text-white">
            <div className="grid grid-cols-2 gap-2">
                <div><b>Nama :</b> <span>{User.name}</span></div>
                <div><b>Role :</b> <span>{User.role}</span></div>
                <div><b>Tanggal Bergabung :</b> <span>00:00 01/01/2000</span></div>
            </div>
        </div>
    </>)
}