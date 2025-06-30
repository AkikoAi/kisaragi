export function getStartAndEndOfMonth(month: number, year: number) {
    const start = new Date(year, month - 1, 1); // Bulan dimulai dari 0
    const end = new Date(year, month, 0, 23, 59, 59, 999); // Hari terakhir bulan ini

    return { start, end };
}

import { NextRequest, NextResponse } from "next/server";
import DataAccessLayer from "@/utils/DataAccessLayer";
import prisma from "@/utils/db";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { absensiGET } from "@/utils/validation";
import { z } from "zod/v4";

export async function GET(req: NextRequest) {
    const data = await DataAccessLayer();
    if (data.privilege < 11) {
        return NextResponse.json({ status: false, msg: ksr_status.unauthorized });
    }

    try {
        const { searchParams } = new URL(req.url);
        const monthParam = searchParams.get("month");
        const yearParam = searchParams.get("year");

        const parsed = absensiGET.safeParse({
            month: Number(monthParam),
            year: Number(yearParam),
        });

        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                msg: z.flattenError(parsed.error).fieldErrors,
            });
        }




        const { month, year } = parsed.data;
        const { start, end } = getStartAndEndOfMonth(month, year);

        const transactionResult = await prisma.$transaction(async (tx) => {
            const attendance = await tx.attendance.findMany({
                where: {
                    userId: data.id,
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
                select: {
                    clockIn: true,
                    clockInIp: true,
                    clockInLocation: true,
                    clockOut: true,
                    clockOutIp: true,
                    clockOutLocation: true
                }
            });

            return { status: true, data: attendance };
        });

        return NextResponse.json(transactionResult);
    } catch (error) {
        console.error(error);
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}
