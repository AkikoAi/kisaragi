"use client";

import Modals from "@/components/Modals";
import { useModals } from "@/hooks/useModals";
import { useEffect, useState } from "react";

export default function AbsenForm() {
    const [location, setLocation] = useState<string>("");
    const [hasClockedIn, setHasClockedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const { modals, modalsError, modalsSuccess } = useModals();

    // Ambil status absen hari ini saat pertama kali load
    useEffect(() => {
        const checkTodayAbsence = async () => {
            try {
                const res = await fetch("/api/(protected)/(61-ManagerOrAdmin)/system-information", {
                    method: "GET",
                });
                const json = await res.json();
                setHasClockedIn(json.status);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        checkTodayAbsence();
    }, []);

    const handleSubmit = async (type: "in" | "out") => {
        if (!location) {
            modalsError("Fubuki bingung... kamu belum isi lokasi loh~");
            return;
        }

        const formData = new FormData();
        formData.append("location", location);

        try {
            const res = await fetch("/api/(protected)/(61-ManagerOrAdmin)/system-information", {
                method: type === "in" ? "PUT" : "POST",
                body: formData,
            });

            const json = await res.json();
            if (json.status) {
                modalsSuccess(type === "in" ? "Absen masuk berhasil~" : "Absen pulang berhasil~");
                if (type === "in") setHasClockedIn(true);
            } else {
                modalsError(json.msg ?? "Ada yang error nih...");
            }
        } catch {
            modalsError("Fubuki tidak bisa menghubungi server~ coba lagi nanti ya!");
        }
    };

    return (
        <>
            <Modals status={modals} loading={false} />
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-bold text-center">Absensi Harian</h2>
                {loading ? (
                    <p className="text-center">Memuat status absen kamu...</p>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Contoh: -6.2,106.8"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <div className="flex gap-2 justify-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => handleSubmit("in")}
                                disabled={hasClockedIn}
                            >
                                Absen Masuk
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={() => handleSubmit("out")}
                                disabled={!hasClockedIn}
                            >
                                Absen Pulang
                            </button>
                        </div>
                        {!hasClockedIn && (
                            <p className="text-sm text-center text-yellow-500">
                                Fubuki: kamu belum absen hari ini loh~ jangan lupa ya!
                            </p>
                        )}
                    </>
                )}
            </div>
        </>);
}
