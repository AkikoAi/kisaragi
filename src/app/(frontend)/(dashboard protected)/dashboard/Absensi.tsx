"use client";

import Modals from "@/Components/Modals";
import { useModals } from "@/Hooks/useModals";
import { useEffect, useState } from "react";


export default function AbsenCard() {
    const [loading, setLoading] = useState<boolean>(true);
    const [hasClockedIn, setHasClockedIn] = useState<boolean>(false);
    const { modals, modalsError } = useModals();

    function handleSubmit(type: "in" | "out") {
        const formData = new FormData();
        formData.append("location", "ambatukan");
        if (type == "in") {

        } else {
            return modalsError("Kurokami bingung... Aksi kamu tidak dikenali~");
        }
    }

    // Ambil status absen hari ini saat pertama kali load
    useEffect(() => {
        const checkTodayAbsence = async () => {
            try {
                const res = await fetch("/api/absen", {
                    method: "GET",
                });
                const json = await res.json();
                setHasClockedIn(json.status);
            } catch {
                modalsError("Fubuki tidak bisa menghubungi server~ coba lagi nanti ya!");
            } finally {
                setLoading(false);
            }
        };
        checkTodayAbsence();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (<>
        <Modals status={modals} loading={false} />

        <section className="my-10">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-bold text-center">
                    Absensi Harian
                </h2>
                {
                    loading ? <p className="text-center">Memuat status absen kamu...</p> :
                        <>
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

                        </>
                }



            </div>

        </section>
    </>)
}