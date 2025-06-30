"use client";

import { useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import Modals from "./Modals";
import { useModals } from "../Hooks/useModals";
import { GiFoxTail } from "react-icons/gi";
import { BsStarFill } from "react-icons/bs";

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
    lat: number;
    lon: number;
    url: string | null;
}

export default function AbsenCard() {
    const developmentFakeLocation = true;

    const [loading, setLoading] = useState<boolean>(true);
    const [onAction, setOnAction] = useState<boolean>(false);
    const [absenResult, setAbsenResult] = useState<AbsenResult>();
    const [lokasi, setLokasi] = useState<LocationType>();
    const { modals, modalsError, modalsWarning, modalsInfo } = useModals();
    const hariIni = new Date();

    async function handleSubmit(type: "in" | "out") {
        if (onAction) return modalsInfo("Harap tunggu proses sebelumnya selesai");
        if (!lokasi) return modalsWarning("Lokasi kamu belum ditangkap, silahkan lakukan kalibrasi lalu klik perbarui lokasi");
        if (type !== "in" && type !== "out") return modalsError("Kurokami bingung... Aksi kamu tidak dikenali~");

        setOnAction(true);
        const formData = new FormData();
        formData.append("location", `${lokasi.lon},${lokasi.lat}`);
        modalsInfo("Permintaan absensi sedang diproses...");

        try {
            const res = await fetch("/api/absen", {
                method: type === "in" ? "PUT" : "POST",
                body: formData,
            });
            const json = await res.json();
            if (!json.status) {
                modalsError(json.msg);
            } else {
                checkTodayAbsence();
            }
        } catch {
            modalsError("Fubuki tidak bisa menghubungi server~ coba lagi nanti ya!");
        }

        setOnAction(false);
    }

    function getLocation() {
        if (!navigator.geolocation) {
            return modalsError("Geolocation tidak didukung di browser ini!");
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const url = new URL("https://www.openstreetmap.org/export/embed.html");
                const param = url.searchParams;
                param.set("bbox", `${longitude},${latitude},${longitude},${latitude}`);
                param.set("layer", "mapnik");
                param.set("marker", `${latitude},${longitude}`);
                setLokasi({ lat: latitude, lon: longitude, url: url.toString() });
            },
            () => {
                if (developmentFakeLocation) {
                    const { latitude, longitude } = { longitude: 102.31, latitude: -3.81 };
                    const url = new URL("https://www.openstreetmap.org/export/embed.html");
                    const param = url.searchParams;
                    param.set("bbox", `${longitude},${latitude},${longitude},${latitude}`);
                    param.set("layer", "mapnik");
                    param.set("marker", `${latitude},${longitude}`);
                    setLokasi({ lat: latitude, lon: longitude, url: url.toString() });
                }
                modalsError("Fubuki tidak bisa mendapatkan lokasi kamu~ pastikan kamu mengizinkan akses lokasi di browser!");
            }
        );
    }

    const checkTodayAbsence = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/absen", { method: "GET" });
            const json = await res.json();
            setAbsenResult(json);
        } catch {
            modalsError("Fubuki tidak bisa menghubungi server~ coba lagi nanti ya!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation();
        checkTodayAbsence();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function AbsenComponent() {
        if (loading) return <p className="text-center">Memuat status absen kamu...</p>;
        if (!absenResult) return <p className="text-center">Absen result null...</p>;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Map Card */}
                <div className="relative w-full rounded-lg border border-cyan-400 shadow shadow-cyan-800 overflow-hidden">
                    <span className="absolute -top-1.5 -right-6 text-yellow-300 text-2xl"><GiFoxTail /></span>
                    <span className="absolute -bottom-3 -left-4 text-yellow-300 text-2xl"><BsStarFill /></span>
                    {lokasi?.url ? (
                        <div className="aspect-[4/3] w-full">
                            <iframe
                                src={lokasi.url}
                                className="w-full h-full"
                                loading="lazy"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="aspect-[4/3] w-full flex items-center justify-center bg-purple-800 border-purple-900">
                            <p className="font-semibold text-yellow-400">LOKASI TIDAK TERDETEKSI</p>
                        </div>
                    )}
                </div>

                {/* Info & Action Card */}
                <div className="flex flex-col justify-between gap-4 p-4 border border-gray-500 dark:border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 shadow">
                    <div className="flex flex-col gap-2">
                        <AbsenTimeComponent />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-4">
                        <button
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={getLocation}
                        >
                            Segarkan Lokasi
                        </button>
                        <div className="flex-1">
                            <AbsenButtonComponent />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function AbsenButtonComponent() {
        if (absenResult?.data) {
            const data = absenResult.data[0];
            if (!data.clockOut)
                return (
                    <button
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => handleSubmit("out")}
                    >
                        Absen Pulang
                    </button>
                );
            if (data.clockOut && data.clockIn)
                return (
                    <button
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        disabled={true}
                    >
                        SELESAI
                    </button>
                );
        }
        return (
            <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleSubmit("in")}
            >
                Absen Masuk
            </button>
        );
    }

    function AbsenTimeComponent() {
        if (absenResult?.data) {
            const data = absenResult.data[0];
            if (data.clockOut)
                return (
                    <p className="font-semibold text-green-500">
                        Kamu telah absen keluar pada pukul{" "}
                        {new Date(data.clockOut).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" })}
                    </p>
                );
            if (data.clockIn)
                return (
                    <p className="font-semibold text-green-500">
                        Kamu telah absen masuk pada pukul{" "}
                        {new Date(data.clockIn).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" })}
                    </p>
                );
        }
        if (absenResult) return <p className="font-semibold text-red-500">{absenResult.msg}</p>;
        return <p className="font-semibold text-red-500">Gagal menghubungi server untuk mendapatkan absensi</p>;
    }

    return (
        <>
            <Modals status={modals} loading={false} />
            <section className="my-10">
                <div className="flex gap-4 items-center mb-4">
                    <FaUserCheck className="text-xl text-green-500" />
                    <h2 className="text-xl font-bold">
                        Absensi pada {hariIni.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" })}
                    </h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 space-y-4">
                    <AbsenComponent />
                </div>
            </section>
        </>
    );
}
