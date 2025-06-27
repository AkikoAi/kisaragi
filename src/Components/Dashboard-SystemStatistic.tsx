import { FaHdd, FaMemory } from "react-icons/fa";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { BsCpu, BsServer } from "react-icons/bs";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

export default function SystemStatistic({ stats, statsTotal }: { stats: SystemStats; statsTotal: StatsTotal }) {
    return (
        <>
            {/* CPU */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                    <BsServer className="text-xl text-green-500" />
                    <h2 className="text-lg font-semibold">Spesifikasi Server</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 p-4">
                    {/* Tentang CPU */}
                    <div className="flex justify-center items-center">
                        <div className="flex items-center gap-4">
                            <BsCpu className="text-xl text-blue-500" />
                            <div>
                                <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                                    {stats.cpu.brand}
                                </h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {stats.cpu.manufacturer}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Detail Lebih Spesifik tentang CPU */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
                        {/* Kecepatan CPU */}
                        <div>
                            <p className="font-semibold mb-1 text-zinc-700 dark:text-zinc-200">Speed (GHz)</p>
                            <span className="text-sm text-zinc-600 dark:text-zinc-300">
                                {stats.cpu.speed.toFixed(2)} (min {stats.cpu.speedMin.toFixed(2)}, max {stats.cpu.speedMax.toFixed(2)})
                            </span>
                        </div>

                        {/* Informasi Processors */}
                        <div>
                            <p className="font-semibold mb-1 text-zinc-700 dark:text-zinc-200">Processors</p>
                            <span className="text-sm text-zinc-600 dark:text-zinc-300">
                                {stats.cpu.processors}
                            </span>
                        </div>

                        {/* Informasi Cores */}
                        <div className="sm:col-span-2">
                            <p className="font-semibold mb-2 text-zinc-700 dark:text-zinc-200">Cores</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <span>Logical</span>
                                <span>{stats.cpu.cores}</span>
                                <span>Physical</span>
                                <span>{stats.cpu.physicalCores}</span>
                                <span>Performance</span>
                                <span>{stats.cpu.performanceCores}</span>
                                <span>Efficiency</span>
                                <span>{stats.cpu.efficiencyCores}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* RAM */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                    <FaMemory className="text-xl text-purple-500" />
                    <h2 className="text-lg font-semibold">Penggunaan RAM</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 p-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 p-4">
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
    )
}
