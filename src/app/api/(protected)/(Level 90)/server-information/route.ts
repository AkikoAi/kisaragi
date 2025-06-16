import { verifyTokenJWT } from '@/utils/ksr_jwt';
import { addLogsFE } from '@/utils/ksr_logs';
import ksr_status from '@/utils/ksr_status';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);

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


    } catch (e) {
        return redirect("/login");
    }
}