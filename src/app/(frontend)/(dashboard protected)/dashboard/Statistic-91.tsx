"use client";

import { useEffect, useState } from "react";
import { FaMemory, FaHdd, FaNetworkWired, FaMicrochip } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

export default function SystemStats() {
    const [stats, setStats] = useState<{
        ram: {
            total: number;
            used: number;
            free: number;
            active: number;
            available: number;
            usedPercent: number;
        },
        cpu: {
            load: string;
        },
        disk: {
            fs: string;
            type: string;
            size: number;
            used: number;
            usePercent: number;
            mount: string;
        }[],
        network: {
            iface: string;
            rx_bytes: number;
            tx_bytes: number;
            rx_sec: number;
            tx_sec: number;
        }[]
    } | null>(null);

    useEffect(() => {
        fetch("/api/system-information")
            .then((res) => res.json())
            .then((data) => {
                if (data.status) setStats(data.data);
            });
    }, []);

    if (!stats) return <p className="p-4 text-center">Memuat statistik sistem...</p>;

    const ramPie = [
        { name: "Digunakan", value: +(stats.ram.used / 1024 / 1024).toFixed(2) },
        { name: "Tersisa", value: +(stats.ram.free / 1024 / 1024).toFixed(2) },
    ];

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <FaMicrochip className="text-blue-500" /> Statistik Sistem
            </h1>

            {/* RAM */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                    <FaMemory className="text-xl text-purple-500" />
                    <h2 className="text-lg font-semibold">Penggunaan RAM</h2>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={ramPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {ramPie.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <p className="text-sm text-center">
                    Total: {(stats.ram.total / 1024 / 1024).toFixed(2)} MB — Digunakan: {(stats.ram.used / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>

            {/* Disk */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                    <FaHdd className="text-xl text-green-500" />
                    <h2 className="text-lg font-semibold">Penggunaan Disk</h2>
                </div>
                <div className="space-y-3">
                    {stats.disk.map((disk, i) => (
                        <div key={i} className="flex flex-col sm:flex-row justify-between">
                            <span className="font-medium">{disk.mount} ({disk.type})</span>
                            <span className="text-sm">
                                {(disk.used / 1024 / 1024).toFixed(1)} MB / {(disk.size / 1024 / 1024).toFixed(1)} MB — {disk.usePercent}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Network */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                    <FaNetworkWired className="text-xl text-indigo-500" />
                    <h2 className="text-lg font-semibold">Statistik Jaringan</h2>
                </div>
                <div className="space-y-3">
                    {stats.network.map((net, i) => (
                        <div key={i} className="flex flex-col sm:flex-row justify-between">
                            <span className="font-medium">{net.iface}</span>
                            <span className="text-sm">
                                RX: {(net.rx_bytes / 1024 / 1024).toFixed(1)} MB — TX: {(net.tx_bytes / 1024 / 1024).toFixed(1)} MB
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
