// CRUD

import prisma from "./src/utils/db";
import { verifyTokenJWT } from "./src/utils/ksr_jwt";
import { addLogsFE } from "./src/utils/ksr_logs";
import ksr_status from "./src/utils/ksr_status";
import { gudangItem, gudangItemBaru, gudangItemUpdate } from "./src/utils/validation";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Create
export async function PUT(req: NextRequest) {
    try {
        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        const User = verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw error

        const { name, description, expired, cupBoardId } = await req.json();
        const input = gudangItemBaru.safeParse({ name, description, expired, cupBoardId });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });
        // Jika data yang dibutuhkan untuk menambahkan item tidak cukup/tidak valid maka akan memberikan respon error

        const proses = await prisma.$transaction(async (tx) => {
            const menambahkanItem = await tx.warehouseItem.create({
                data: {
                    cupBoardId: input.data.cupBoardId,
                    name: input.data.name,
                    description: input.data.description,
                    expired: input.data.expired,
                    inCupBoard: true,
                    lastCheck: null
                }
            });

            const menambahkanLog = await tx.warehouseLog.create({
                data: {
                    userId: User.id,
                    ItemId: menambahkanItem.id,
                }
            });

            return { menambahkanItem, menambahkanLog };
        });

        return NextResponse.json({ status: true, data: proses });
    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// READ
export async function GET(req: NextRequest) {
    try {
        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw

        const { page, limit } = await req.json();
        const input = gudangItem.safeParse({ page, limit });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });
        // Jika input yang dimasukkan tidak valid maka akan mengirim respon

        const Item = await prisma.warehouseItem.findMany({
            take: input.data.limit,
            skip: (input.data.page - 1) * input.data.limit,
            orderBy: {
                createdAt: 'desc'// Diurutkan dari yang terbaru ditambahkan
            }
        });

        return NextResponse.json({ status: false, data: Item });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// Update
export async function POST(req: NextRequest) {
    try {
        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        const User = verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw

        const { ItemId, name, description, expired, cupBoardId } = await req.json();
        const input = gudangItemUpdate.safeParse({ ItemId, name, description, expired, cupBoardId });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });
        // Jika data yang dibutuhkan untuk menambahkan item tidak cukup/tidak valid maka akan memberikan respon error

        const proses = await prisma.$transaction(async (tx) => {
            const date = new Date();
            const updateItem = await tx.warehouseItem.update({
                where: {
                    id: input.data.ItemId
                },
                data: {
                    cupBoardId: input.data.cupBoardId,
                    name: input.data.name,
                    description: input.data.description,
                    expired: input.data.expired,
                    inCupBoard: true,
                    lastCheck: date,
                    updatedAt: date
                }
            });

            const menambahkanLog = await tx.warehouseLog.create({
                data: {
                    userId: User.id,
                    ItemId: updateItem.id,
                    createdAt: date
                }
            });


            return { updateItem, menambahkanLog };
        });

        return NextResponse.json({ status: true, data: proses });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

// Delete
export async function DELETE(req: NextRequest) {
    try {
        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw

        const { ItemId } = await req.json()
        const input = gudangItemUpdate.safeParse({ ItemId });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });
        // Jika data yang dibutuhkan untuk menambahkan item tidak cukup/tidak valid maka akan memberikan respon error

        const proses = await prisma.$transaction(async (tx) => {
            const Item = await tx.warehouseItem.findUnique({ where: { id: input.data.ItemId } });
            if (!Item) return new Error("Item Tidak ada");

            const hapusItem = await tx.warehouseItem.update({
                where: {
                    id: ItemId,
                },
                data: {
                    isDeleted: true
                }
            });

            return { hapusItem, Item };
        });
        if (proses instanceof Error) return NextResponse.json({ status: false, msg: proses.message });
        return NextResponse.json({ status: true, data: proses });
    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}