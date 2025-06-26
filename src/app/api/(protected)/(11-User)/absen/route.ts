import DataAccessLayer from "@/utils/DataAccessLayer";
import prisma from "@/utils/db";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { absenPost } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";

function getStartAndEndOfToday() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}

export async function GET(req: NextRequest) {
    const data = await DataAccessLayer();
    if (data.privilege < 11) {
        return NextResponse.json({ status: false, msg: ksr_status.unauthorized });
    }

    try {
        const { start, end } = getStartAndEndOfToday();
        // Ambil data absensi hari ini
        const absensi = await prisma.attendance.findMany({
            where: {
                userId: data.id,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });

        if (absensi.length === 0) return NextResponse.json({ status: false, msg: ksr_status.belum_absen_hari_ini });
        return NextResponse.json({ status: true, data: absensi });
    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// ✅ Absen masuk
export async function PUT(req: NextRequest) {
    const data = await DataAccessLayer();
    if (data.privilege < 11) {
        return NextResponse.json({ status: false, msg: ksr_status.unauthorized });
    }

    try {
        const body = await req.formData();
        const location = body.get("location");

        const validationResult = absenPost.safeParse({ location });
        if (!validationResult.success) {
            return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });
        }

        const { start, end } = getStartAndEndOfToday();

        const transactionResult = await prisma.$transaction(async (tx) => {
            // Cek apakah sudah absen hari ini
            const existing = await tx.attendance.findFirst({
                where: {
                    userId: data.id,
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            });

            if (existing) {
                return { status: false, msg: "Kamu sudah absen hari ini~" };
            }

            const result = await tx.attendance.create({
                data: {
                    userId: data.id,
                    clockInLocation: validationResult.data.location,
                },
            });
            return { status: true, data: result };
        });


        return NextResponse.json(transactionResult);
    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// ✅ Absen pulang
export async function POST(req: NextRequest) {
    const data = await DataAccessLayer();
    if (data.privilege < 11) {
        return NextResponse.json({ status: false, msg: ksr_status.unauthorized });
    }

    try {
        const body = await req.formData();
        const location = body.get("location");

        const validationResult = absenPost.safeParse({ location });
        if (!validationResult.success) {
            return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });
        }

        const { start, end } = getStartAndEndOfToday();

        const transactionResult = await prisma.$transaction(async (tx) => {

            const existing = await tx.attendance.findFirst({
                where: {
                    userId: data.id,
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            });

            if (!existing) {
                return { status: false, msg: "Belum absen masuk hari ini~" };
            }

            // Update clockOut
            const result = await tx.attendance.update({
                where: { id: existing.id },
                data: {
                    clockOutLocation: validationResult.data.location,
                    clockOut: new Date(),
                },
            });
            return { status: true, data: result };
        });

        return NextResponse.json(transactionResult);
    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}
