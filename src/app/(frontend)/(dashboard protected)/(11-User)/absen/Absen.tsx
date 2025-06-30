"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { FaMapMarkedAlt } from "react-icons/fa";
import { BsCalendar2MonthFill } from "react-icons/bs";

interface AbsensiType {
    clockIn: string;
    clockOut: string | null;
    clockInIp: string;
    clockOutIp: string | null;
    clockInLocation: string;
    clockOutLocation: string | null;
}

export default function AbsensiPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const today = new Date();
    const defaultMonth = today.getMonth() + 1;
    const defaultYear = today.getFullYear();

    const [month, setMonth] = useState(Number(searchParams.get("month")) || defaultMonth);
    const [year, setYear] = useState(Number(searchParams.get("year")) || defaultYear);
    const [data, setData] = useState<AbsensiType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<AbsensiType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ month: month.toString(), year: year.toString() });
                const res = await fetch(`/api/absen/all?${params}`);
                const json = await res.json();
                if (json.status) setData(json.data);
            } catch (err) {
                console.error("Gagal mengambil data absensi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [month, year]);

    const handleChangeMonthYear = (e: React.FormEvent) => {
        e.preventDefault();
        router.replace(`?month=${month}&year=${year}`);
    };

    function AbsenModal() {
        const data = selected;
        if (!data) return null;

        const toMapUrl = (coord: string) => {
            const [lat, lon] = coord.split(",");
            const url = new URL("https://www.openstreetmap.org/export/embed.html");
            url.searchParams.set("bbox", `${lon},${lat},${lon},${lat}`);
            url.searchParams.set("layer", "mapnik");
            url.searchParams.set("marker", `${lat},${lon}`);
            return url.toString();
        };

        const mapInURL = data.clockInLocation ? toMapUrl(data.clockInLocation) : null;
        const mapOutURL = data.clockOutLocation ? toMapUrl(data.clockOutLocation) : null;

        return (
            <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 flex items-center justify-center p-2 sm:p-6">
                <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh] relative">
                    <button
                        onClick={() => setSelected(null)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                        aria-label="Tutup"
                    >
                        ✕
                    </button>

                    <h3 className="text-lg sm:text-xl font-bold mb-4">Detail Absensi</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Lokasi Masuk</h4>
                            {mapInURL ? (
                                <iframe src={mapInURL} className="w-full aspect-[4/3] rounded border dark:border-gray-700" />
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tidak tersedia</p>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Lokasi Keluar</h4>
                            {mapOutURL ? (
                                <iframe src={mapOutURL} className="w-full aspect-[4/3] rounded border dark:border-gray-700" />
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tidak tersedia</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <p><span className="font-medium">Waktu Masuk:</span> {format(parseISO(data.clockIn), "dd MMM yyyy HH:mm", { locale: id })}</p>
                        <p><span className="font-medium">Waktu Keluar:</span> {data.clockOut ? format(parseISO(data.clockOut), "dd MMM yyyy HH:mm", { locale: id }) : "-"}</p>
                        <p><span className="font-medium">IP Masuk:</span> {data.clockInIp}</p>
                        <p><span className="font-medium">IP Keluar:</span> {data.clockOutIp || "-"}</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <section className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
                <BsCalendar2MonthFill className="text-2xl text-blue-500" />
                <h2 className="text-2xl font-bold">Riwayat Absensi Bulanan</h2>
            </div>

            {/* Filter */}
            <form onSubmit={handleChangeMonthYear} className="flex gap-2 flex-wrap mb-6 items-center">
                <div>
                    <label className="block text-sm font-medium">Bulan</label>
                    <select value={month} onChange={e => setMonth(Number(e.target.value))} className="border p-2 rounded text-white dark:text-white dark:bg-gray-800">
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{format(new Date(2023, i, 1), "MMMM", { locale: id })}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Tahun</label>
                    <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border p-2 rounded w-24" min="2000" max="2100" />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded h-fit mt-5">Terapkan</button>
            </form>

            {/* Table */}
            {loading ? (
                <p>⏳ Memuat data absensi...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-300 dark:border-gray-600">
                        <thead className="bg-blue-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                            <tr>
                                <th className="p-2 border">Tanggal</th>
                                <th className="p-2 border">Masuk</th>
                                <th className="p-2 border">Pulang</th>
                                <th className="p-2 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((absen, idx) => (
                                <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                                    <td className="p-2 border  dark:border-gray-600">{format(parseISO(absen.clockIn), "dd MMM yyyy", { locale: id })}</td>
                                    <td className="p-2 border dark:border-gray-600">{format(parseISO(absen.clockIn), "HH:mm")}</td>
                                    <td className="p-2 border dark:border-gray-600">{absen.clockOut ? format(parseISO(absen.clockOut), "HH:mm") : "-"}</td>
                                    <td className="p-2 border text-center">
                                        <button className="text-blue-600 hover:underline flex items-center gap-1 mx-auto" onClick={() => setSelected(absen)}>
                                            <FaMapMarkedAlt /> Tinjau
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-gray-500">
                                        Tidak ada data absensi untuk bulan ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <AbsenModal />
        </section>
    );
}
