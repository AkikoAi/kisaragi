"use client";


import SystemStatistic from "@/Components/Dashboard-SystemStatistic";
import { useState, useEffect, useRef } from "react";
import { FaMicrochip } from "react-icons/fa";


export default function PostgresInfoDashboard() {

    const [stats, setStats] = useState<SystemStats | null>(null);
    const [statsTotal, setStatsTotal] = useState<StatsTotal | null>(null);
    const [intervalMs, setIntervalMs] = useState<number | null>(null); // default 10 detik
    const isMounted = useRef(true);

    const fetchSystemStats = async () => {
        try {
            const res = await fetch("/api/system-information");
            const json = await res.json();
            if (!json.status) return;

            const current: SystemStats = json.data;
            setStats(current);
            const totalDiskUsed = current.disk.reduce((acc, disk) => acc + disk.used, 0);
            const totalDiskSize = current.disk.reduce((acc, disk) => acc + disk.size, 0);
            setStatsTotal({ diskTotal: totalDiskSize, diskUsed: totalDiskUsed });
            console.log(!stats || !statsTotal, !statsTotal, statsTotal);
        } catch { }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchSystemStats(); }, []);

    useEffect(() => {
        isMounted.current = true;

        const poll = async () => {

            if (!isMounted.current || intervalMs === null) return;

            await fetchSystemStats(); // tunggu fetch selesai
            if (!isMounted.current || intervalMs === null) return;

            setTimeout(poll, intervalMs); // delay baru polling ulang
        };

        poll(); // mulai polling

        return () => {
            isMounted.current = false;
        };
    }, [intervalMs]); // eslint-disable-line react-hooks/exhaustive-deps




    // ...Rendering logic omitted to keep this response short

    return (<>

        <section>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <FaMicrochip className="text-blue-500" /> Statistik Sistem
                </h1>
                <div className="flex items-center gap-2">
                    <label htmlFor="interval" className="text-sm text-gray-600 dark:text-gray-300">
                        Interval:
                    </label>
                    <select
                        id="interval"
                        className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                        value={intervalMs ?? 0}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setIntervalMs(val === 0 ? null : val);
                        }}
                    >
                        <option value={0}>Off</option>
                        <option value={5000}>5s</option>
                        <option value={10000}>10s</option>
                        <option value={30000}>30s</option>
                        <option value={60000}>60s</option>
                    </select>
                </div>
            </div>
            <div className="space-y-6">
                {!stats || !statsTotal ? (
                    <div className="flex items-center justify-center p-4 text-center">
                        <p>Memuat statistik sistem...</p>
                    </div>
                ) : (<SystemStatistic stats={stats} statsTotal={statsTotal} />)}
            </div>


        </section>

    </>);
}
