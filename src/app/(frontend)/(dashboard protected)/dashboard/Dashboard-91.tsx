"use client";

import { useState, useEffect, useRef } from "react";
import { FaHdd, FaMemory, FaMicrochip } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

interface RamStats {
    total: number;
    used: number;
    free: number;
    active: number;
    available: number;
    usedPercent: number;
}

interface CpuStats {
    load: string;
}

interface DiskStats {
    fs: string;
    type: string;
    size: number;
    used: number;
    usePercent: number;
    mount: string;
}

interface NetworkStats {
    iface: string;
    rx_bytes: number;
    tx_bytes: number;
    rx_sec: number;
    tx_sec: number;
}

interface SystemStats {
    ram: RamStats;
    cpu: CpuStats;
    disk: DiskStats[];
    network: NetworkStats[];
}

interface PgQuery {
    pid: number;
    usename: string;
    application_name: string;
    state: string;
    query: string;
    backend_start: Date;
    query_start: Date;
}

interface PgStats {
    serverTime: Date;
    serverVersion: string;
    tables: string[];
    activeQueries: PgQuery[];
}

interface ServerStats {
    platform: NodeJS.Platform;
    arch: string;
    cpuCount: number;
    cpuModel: string;
    memoryInfo: {
        total: number;
        free: number;
    };
    uptimeSeconds: number;
}

interface StatsTotal {
    diskUsed: number;
    diskTotal: number;

}

export default function PostgresInfoDashboard() {
    const [pgData, setPgData] = useState<PgStats | null>(null);
    const [serverData, setServerData] = useState<ServerStats | null>(null);
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [statsTotal, setStatsTotal] = useState<StatsTotal | null>(null);
    const [loading, setLoading] = useState<("database" | "server")[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [errorServer, setErrorServer] = useState<string | null>(null);
    const [intervalMs, setIntervalMs] = useState<number | null>(null); // default 10 detik
    const isMounted = useRef(true);

    const toggleLoading = (id: "database" | "server", action: "ADD" | "DEL") => {
        setLoading((prev) =>
            action === "ADD"
                ? prev.includes(id) ? prev : [...prev, id]
                : prev.filter((item) => item !== id)
        );
    };

    const getDatabaseInformation = async () => {
        if (loading.includes("database")) return;
        toggleLoading("database", "ADD");
        try {
            const res = await fetch("/api/database-information");
            const json = await res.json();
            if (json.status) setPgData(json.data);
            else setError("Failed to load data");
        } catch {
            setError("Failed to load data");
        } finally {
            toggleLoading("database", "DEL");
        }
    };

    const getServerInformation = async () => {
        if (loading.includes("server")) return;
        toggleLoading("server", "ADD");
        try {
            const res = await fetch("/api/server-information");
            const json = await res.json();
            if (json.status) setServerData(json.data);
            else setErrorServer("Failed to load data");
        } catch {
            setErrorServer("Failed to load data");
        } finally {
            toggleLoading("server", "DEL");
        }
    };

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
    useEffect(() => { getDatabaseInformation(); getServerInformation(); fetchSystemStats(); }, []);

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
                ) : (
                    <>
                        {/* RAM */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <FaMemory className="text-xl text-purple-500" />
                                <h2 className="text-lg font-semibold">Penggunaan RAM</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                                <div className="h-60">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                dataKey="value"
                                                data={[
                                                    { name: "Digunakan", value: +(stats.ram.used / stats.ram.total * 100).toFixed(2) },
                                                    { name: "Tersisa", value: +(stats.ram.free / stats.ram.total * 100).toFixed(2) },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {[0, 1].map((index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="h-60 flex flex-col justify-center space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full bg-[#0088FE]"
                                            />
                                            <span className="font-medium">
                                                Digunakan
                                            </span>
                                        </div>
                                        <span className="text-sm">{(stats.ram.used / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full bg-[#FF8042]"
                                            />
                                            <span className="font-medium">
                                                Tersisa
                                            </span>
                                        </div>
                                        <span className="text-sm">{((stats.ram.total - stats.ram.used) / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full dark:bg-white bg-black"
                                            />
                                            <span className="font-medium">
                                                Total
                                            </span>
                                        </div>
                                        <span className="text-sm">{(stats.ram.total / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disk */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <FaHdd className="text-xl text-green-500" />
                                <h2 className="text-lg font-semibold">Penggunaan Disk</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                                <div className="h-60">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                dataKey="value"
                                                data={stats.disk.map((disk) => ({
                                                    name: `${disk.mount} (${disk.type})`,
                                                    value: Number((disk.used / statsTotal.diskTotal * 100).toFixed(2)),// Menghitung persentase penggunaan
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {stats.disk.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="h-60 flex flex-col justify-center space-y-2">
                                    {stats.disk.map((disk, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="inline-block w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                                />
                                                <span className="font-medium">
                                                    {disk.mount} ({disk.type})
                                                </span>
                                            </div>
                                            <span className="text-sm">
                                                {(disk.used / 1024 / 1024 / 1024).toFixed(1)} GB / {(disk.size / 1024 / 1024 / 1024).toFixed(1)} GB — {disk.usePercent}%
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full dark:bg-white bg-black"
                                            />
                                            <span className="font-medium">
                                                TOTAL
                                            </span>
                                        </div>
                                        <span className="text-sm">
                                            {(statsTotal.diskUsed / 1024 / 1024 / 1024).toFixed(1)} GB / {(statsTotal.diskTotal / 1024 / 1024 / 1024).toFixed(1)} GB — {(statsTotal.diskUsed / statsTotal.diskTotal * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>



        <section className="mt-10">
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Postgres Server Info</h2>
                <button
                    className="flex gap-2 items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                    onClick={getDatabaseInformation}
                    disabled={loading.includes("database")}
                >
                    <RiRefreshLine className={loading.includes("database") ? "animate-spin" : ""} />
                    <span>Segarkan</span>
                </button>
            </div>
            <div className="mt-4 p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md shadow-md">
                {loading.includes("database") || !pgData ? <div className="p-4">Loading Postgres Info...</div> :
                    error ? <div className="p-4 text-red-600">{error}</div> :
                        <>
                            <div className="md:grid md:grid-cols-2 md:gap-4 space-y-6">
                                <div>
                                    <h3 className="font-medium">Server Time</h3>
                                    <p>{new Date(pgData.serverTime).toLocaleString()}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium">Server Version</h3>
                                    <p>{pgData.serverVersion}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium">Tables</h3>
                                    <ul className="list-disc list-inside">
                                        {pgData.tables.length > 1 ? pgData.tables.map((table, idx) => (
                                            <li key={idx}>{table}</li>
                                        )) : "-"}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium">Active Queries</h3>
                                {pgData.activeQueries.length === 0 ? (
                                    <p>No active queries</p>
                                ) : (
                                    <table className="table-auto w-full text-sm mt-2">
                                        <thead>
                                            <tr>
                                                <th>PID</th>
                                                <th>User</th>
                                                <th>State</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pgData.activeQueries.map((query, idx) => (
                                                <tr key={idx} className="border-t text-center">
                                                    <td>{query.pid}</td>
                                                    <td>{query.usename}</td>
                                                    <td>{query.state}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                }
            </div>
        </section >

        <section className="mt-10">
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Server Info</h2>
                <button
                    className="flex gap-2 items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                    onClick={getServerInformation}
                    disabled={loading.includes("server")}
                >
                    <RiRefreshLine className={loading.includes("server") ? "animate-spin" : ""} />
                    <span>Segarkan</span>
                </button>
            </div>
            <div className="mt-4 p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md shadow-md">
                {loading.includes("server") || !serverData ? <div className="p-4">Loading Server Info...</div> :
                    errorServer ? <div className="p-4 text-red-600">{errorServer}</div> :
                        <>
                            <div className="md:grid md:grid-cols-2 md:gap-4 space-y-6">
                                <div>
                                    <h3 className="font-medium">Platform</h3>
                                    <p>{serverData.platform}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium">Arch</h3>
                                    <p>{serverData.arch}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium">Cpu Count</h3>
                                    <p>{serverData.cpuCount}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium">Cpu Model</h3>
                                    <p>{serverData.cpuModel}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium">Uptime Seconds</h3>
                                    <p>{serverData.uptimeSeconds}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium">Memory Info</h3>
                                <table className="table-auto w-full text-sm mt-2">
                                    <thead>
                                        <tr>
                                            <th>free</th>
                                            <th>total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t text-center">
                                            <td>{serverData.memoryInfo.free}</td>
                                            <td>{serverData.memoryInfo.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                }
            </div>
        </section >

    </>);
}
