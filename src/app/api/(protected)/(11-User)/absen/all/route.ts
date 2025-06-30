function getStartAndEndOfMonth(month: number) {
    const now = new Date();
    const year = now.getFullYear(); // atau bisa juga diambil dari query kalau mau fleksibel

    const start = new Date(year, month, 1); // awal bulan
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999); // akhir bulan (jam 23:59:59.999)

    return { start, end };
}



import DataAccessLayer from "@/utils/DataAccessLayer";
import prisma from "@/utils/db";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { absensiGET } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const data = await DataAccessLayer();
    if (data.privilege < 11) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

    try {
        const { searchParams } = new URL(req.url);
        const startParam = searchParams.get("start");
        const endParam = searchParams.get("end");
        const monthParam = searchParams.get("month");
        console.log(startParam,endParam,monthParam);

        const { data: input, ...validationResult } = absensiGET.safeParse({ start:startParam, end:endParam, month:monthParam });
        if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });

        let start: Date;
        let end: Date;

        if (input?.month) {
            ({ start, end } = getStartAndEndOfMonth(input.month-1));
        }else if(input?.start && input.end){
            start = new Date(input.start);
            end = new Date(input.end);
        }

        const transactionResult = await prisma.$transaction(async (tx) => {
            const attendance = await tx.attendance.findMany({
                where: {
                    userId: data.id,
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                }
            });

            return { status: true, data: attendance };
        });

        return NextResponse.json(transactionResult);

    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}
