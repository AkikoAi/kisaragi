import { addLogsFE } from './src/utils/ksr_logs';
import ksr_status from './src/utils/ksr_status';
import { NextResponse } from 'next/server';
import os from 'os';
import DataAccessLayer from '../../../../../utils/DataAccessLayer';

export async function GET() {
    const data = await DataAccessLayer();

    // 61 Manager/Admin
    if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });
    try {
        const cpuInfo = os.cpus();
        const memoryInfo = {
            total: os.totalmem(),
            free: os.freemem()
        };
        const uptime = os.uptime();

        return NextResponse.json({
            status: true, data: {
                platform: os.platform(),
                arch: os.arch(),
                cpuCount: cpuInfo.length,
                cpuModel: cpuInfo[0].model,
                memoryInfo,
                uptimeSeconds: uptime
            }
        });
    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}