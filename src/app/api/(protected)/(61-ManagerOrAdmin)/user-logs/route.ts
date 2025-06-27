
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { NextResponse } from "next/server";
import DataAccessLayer from "../../../../../utils/DataAccessLayer";
import prisma from "@/utils/db";


export async function GET() {
    const data = await DataAccessLayer();

    if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

    try {
        const data = await prisma.logs.findMany({ where: { type: "USER" }, orderBy: { timestamp: 'desc' } });
        return NextResponse.json({ status: true, data })
    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}