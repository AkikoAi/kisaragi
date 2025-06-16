import prisma from "@/utils/db";
import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);

        if (data.privilege < 90) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

        try {
            const info = await getPostgresInfo();
            return NextResponse.json({ status: true, data: info });
        } catch (e) {
            addLogsFE(e)
            return NextResponse.json({ status: false, msg: ksr_status[500] })
        }

    } catch (e) {
        return redirect("/login");
    }
}


async function getPostgresInfo() {
    const data = await prisma.$transaction(async (tx) => {
        const time = await tx.$queryRaw<{ now: Date }[]>`SELECT NOW() as now;`;
        const version = await tx.$queryRaw<{ server_version: string }[]>`SHOW server_version;`;
        const tables = await tx.$queryRaw<{ table_name: string }[]>`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
        const activities = await tx.$queryRaw<{
            pid: number;
            usename: string;
            application_name: string;
            state: string;
            query: string;
            backend_start: Date;
            query_start: Date;
        }[]>`
  SELECT pid, usename, application_name, state, backend_start, query_start
  FROM pg_stat_activity
  WHERE state != 'idle';
`;
        const stats = await tx.$queryRaw<{
            datname: string;
            numbackends: number;
            xact_commit: number;
            xact_rollback: number;
            blks_read: number;
            blks_hit: number;
        }[]>`
SELECT datname, numbackends, xact_commit, xact_rollback, blks_read, blks_hit
FROM pg_stat_database
WHERE datname = current_database();
`
        return {
            serverTime: time[0].now,
            serverVersion: version[0].server_version,
            tables: tables.map(t => t.table_name),
            activeQueries: activities,
            //connectionStats: stats[0]
        };
    });
    return data;
}
