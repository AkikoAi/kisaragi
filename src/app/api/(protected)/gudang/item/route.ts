// CRUD

import prisma from "@/utils/db";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { gudangItemBaru } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";

// Create
export async function PUT(req: NextRequest) {
    try {
        const { name, description, expired, cupBoardId } = await req.json();
        const data = gudangItemBaru.safeParse({ name, description, expired, cupBoardId });
        if (!data.success) return NextResponse.json({ status: false, msg: JSON.parse(data.error.message) });

        const menambahkanItem = prisma.warehouseItem.create()
    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// READ
export async function GET() {
    try {
con
    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// Update
export async function POST() {
    try {

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// Delete
export async function DELETE() {
    try {

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}