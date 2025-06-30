import prisma from "@/utils/db";
import ksr_status from "@/utils/ksr_status";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ status: false, msg: ksr_status.unauthorized });
    const data = await prisma.attendance.deleteMany()
    return NextResponse.json({ status: true, data });
}