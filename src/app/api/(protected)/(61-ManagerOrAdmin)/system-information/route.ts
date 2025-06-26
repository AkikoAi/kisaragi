import { NextResponse } from "next/server";
import si from "systeminformation";
import ksr_status from "@/utils/ksr_status";
import DataAccessLayer from "@/utils/DataAccessLayer";

export async function GET() {
    try {
        const data = await DataAccessLayer();
        if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });
        // Ambil informasi sistem
        const [
            mem,
            fsSize,
            networkStats,
            //   currentLoad,
            //    diskIO
        ] = await Promise.all([
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            //si.currentLoad(),
            //si.disksIO()
        ]);

        const sistemResult = {
            ram: {
                total: mem.total,
                used: mem.used,
                free: mem.free,
                active: mem.active,
                available: mem.available,
                usedPercent: +(mem.used / mem.total * 100).toFixed(2),
            },
            cpu: {
                load: "??"// +(currentLoad.currentLoad).toFixed(2),
            },
            disk: fsSize.map(disk => ({
                fs: disk.fs,
                type: disk.type,
                size: disk.size,
                used: disk.used,
                usePercent: disk.use,
                mount: disk.mount
            })),
            network: networkStats.map(net => ({
                iface: net.iface,
                rx_bytes: net.rx_bytes,
                tx_bytes: net.tx_bytes,
                rx_sec: net.rx_sec,
                tx_sec: net.tx_sec
            }))
        };

        return NextResponse.json({ status: true, data: sistemResult });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] })
    }
}
