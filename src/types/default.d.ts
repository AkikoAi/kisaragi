
interface RamStats {
    total: number;
    used: number;
    free: number;
    active: number;
    available: number;
    usedPercent: number;
}

interface CpuStats {
    speed: number;
    speedMin: number;
    speedMax: number;
    cores: number;
    physicalCores: number;
    performanceCores: number | undefined;
    efficiencyCores: number | undefined;
    processors: number;
    manufacturer: string;
    brand: string;
}

interface DiskStats {
    fs: string;
    type: string;
    size: number;
    used: number;
    usePercent: number;
    mount: string;
}

interface SystemStats {
    ram: RamStats;
    cpu: CpuStats;
    disk: DiskStats[];
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
