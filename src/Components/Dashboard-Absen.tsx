"use client";

import { useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import Modals from "./Modals";
import { useModals } from "../Hooks/useModals";

interface AbsenResult {
    status: boolean;
    msg?: string;
    data?: {
        id: string;
        clockIn: Date;
        clockOut: Date | null;
    }[];
}

interface LocationType {
    lat: number; lon: number; url: string | null
}

export default function AbsenCard() {
    const [loading, setLoading] = useState<boolean>(true);
    const [absenResult, setAbsenResult] = useState<AbsenResult>();
    const [lokasi, setLokasi] = useState<LocationType>();
    const { modals, modalsError } = useModals();

    function handleSubmit(type: "in" | "out") {
        const formData = new FormData();
        formData.append("location", "ambatukan");
        if (type == "in") {

        } else {
            return modalsError("Kurokami bingung... Aksi kamu tidak dikenali~");
        }
    }

    /**
     * Fungsi untuk mendapatkan lokasi pengguna
     * Menggunakan Geolocation API untuk mendapatkan koordinat
     */
    function getLocation() {
        if (!navigator.geolocation) {
            console.log("Geolocation tidak didukung browser ini.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const url = new URL("https://www.openstreetmap.org/export/embed.html");
                const param = url.searchParams;
                param.set("bbox", `${longitude},${latitude},${longitude},${latitude}`)
                param.set("layer", "mapnik");
                param.set("marker", `${latitude},${longitude}`);

                setLokasi({ lat: latitude, lon: longitude, url: url.toString() });
            },
            () => {
                modalsError("Fubuki tidak bisa mendapatkan lokasi kamu~ pastikan kamu mengizinkan akses lokasi di browser!");
            }
        );
    }

    /**
     * Cek apakah sudah absen hari ini
     * Jika sudah, setHasClockedIn ke true
     * Jika belum, setHasClockedIn ke false
     * Jika terjadi error, tampilkan pesan error
     */
    const checkTodayAbsence = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/absen", {
                method: "GET",
            });
            const json = await res.json();
            setAbsenResult(json);
        } catch {
            modalsError("Fubuki tidak bisa menghubungi server~ coba lagi nanti ya!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation(); // Ambil lokasi saat komponen dimuat
        checkTodayAbsence(); // Cek apakah sudah absen hari ini
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (<>
        <Modals status={modals} loading={false} />

        <section className="my-10">
            <div className="flex gap-4 items-center mb-4">
                <FaUserCheck className="text-xl text-green-500" />
                <h2 className="text-xl font-bold">
                    Absensi pada {new Date().toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" })}
                </h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                {loading ? <p className="text-center">Memuat status absen kamu...</p> :
                    !absenResult ? <p className="text-center">Absen result null...</p> :
                        <AfterLoading lokasi={lokasi} absenResult={absenResult} handleSubmit={handleSubmit} />}
            </div>


        </section>
    </>)
}

/// Componen yang ditampilkan setelah status absen dimuat
function AfterLoading({ absenResult, handleSubmit, lokasi }: { absenResult: AbsenResult; handleSubmit: (type: "in" | "out") => void, lokasi: LocationType | undefined }) {
    return <>
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex">
                <p className={`font-semibold ${absenResult.status ? "text-green-500" : "text-red-500"}`}>{absenResult.status ? `Kamu telah absen pada pukul ${absenResult}` : absenResult.msg}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {lokasi && lokasi.url ?
                    <div>
                        <iframe width="425" height="350" src={lokasi.url}></iframe>

                    </div>
                    :
                    <p className="font-semibold text-red-500">MAP TIDAK TERSEDIA</p>}
                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handleSubmit("in")}
                    >
                        Absen Masuk
                    </button>
                    <button
                        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600`}
                        onClick={() => handleSubmit("out")}
                    >
                        Absen Pulang
                    </button>
                </div>
            </div>
        </div>

    </>
}