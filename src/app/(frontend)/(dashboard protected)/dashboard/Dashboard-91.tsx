"use client";
import  { useState, useEffect, useCallback } from "react";
import { RiRefreshLine } from "react-icons/ri";

export default function PostgresInfoDashboard() {
    const [data, setData] = useState<null | {
        serverTime: Date;
        serverVersion: string;
        tables: string[];
        activeQueries: {
            pid: number;
            usename: string;
            application_name: string;
            state: string;
            query: string;
            backend_start: Date;
            query_start: Date;
        }[];
    }>(null);
    const [serverData, setServerData] = useState<null | {
        platform: NodeJS.Platform;
        arch: string;
        cpuCount: number;
        cpuModel: string;
        memoryInfo: {
            total: number;
            free: number;
        };
        uptimeSeconds: number;
    }>(null);
    const [loading, setLoading] = useState<("database" | "server")[]>([]);
    const [error, setError] = useState<null | string>(null);
    const [errorServer, setErrorServer] = useState<null | string>(null);

    const Loading = useCallback((id: "database" | "server", act: "DEL" | "ADD") => {
        if (act === "ADD" && !loading.includes(id)) {
            setLoading((prev) => [...prev, id]);
        } else if (act === "DEL") {
            setLoading((prev) => prev.filter(item => item !== id));
        }
    }, [loading]);

    const getDatabaseInformation = useCallback(async () => {
        try {
            if (loading.includes("database")) return;
            Loading("database", "ADD");
            const res = await fetch("/api/database-information");
            const json = await res.json();
            if (json.status) return setData(json.data);
            return setError("Failed to load data");
        } catch {
            setError("Failed to load data");
        } finally {
            Loading("database", "DEL");
        }
    }, [Loading, loading]);

    const getServerInformation = useCallback(async () => {
        try {
            if (loading.includes("server")) return;
            Loading("server", "ADD");
            const res = await fetch("/api/server-information");
            const json = await res.json();
            if (json.status) return setServerData(json.data);
            return setErrorServer("Failed to load data");
        } catch {
            setErrorServer("Failed to load data");
        } finally {
            Loading("server", "DEL");
        }
    }, [Loading, loading]);

    useEffect(() => {
        getServerInformation();
        getDatabaseInformation();
    }, [getServerInformation, getDatabaseInformation]);


    return (
        <>
            <section>
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
                    {loading.includes("database") || !data ? <div className="p-4">Loading Postgres Info...</div> :
                        error ? <div className="p-4 text-red-600">{error}</div> :
                            <>
                                <div className="md:grid md:grid-cols-2 md:gap-4 space-y-6">
                                    <div>
                                        <h3 className="font-medium">Server Time</h3>
                                        <p>{new Date(data.serverTime).toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium">Server Version</h3>
                                        <p>{data.serverVersion}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium">Tables</h3>
                                        <ul className="list-disc list-inside">
                                            {data.tables.length > 1 ? data.tables.map((table, idx) => (
                                                <li key={idx}>{table}</li>
                                            )) : "-"}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium">Active Queries</h3>
                                    {data.activeQueries.length === 0 ? (
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
                                                {data.activeQueries.map((query, idx) => (
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
        </>
    );
}
