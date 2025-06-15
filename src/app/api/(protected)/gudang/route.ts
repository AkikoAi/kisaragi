import prisma from "@/utils/db";
import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { gudangBoard, gudangBoardUpdate, gudangItem } from "@/utils/validation";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        const User = verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw error

        const { limit, page, search } = await req.json();
        const input = gudangItem.safeParse({ limit, page, search });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });

        const Board = await prisma.warehouseCupBoard.findMany({
            take: input.data.limit,
            skip: input.data.limit * input.data.page - input.data.limit,
            orderBy: {
                name: "asc"// Mengurutkan dari terkecil ke terbesar Contoh (a,b,c,d,...)
            },
            ...(input.data.search ? { where: { name: input.data.search } } : {})
        });

        return NextResponse.json({ status: true, data: Board });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

export async function PUT(req: NextResponse) {
    try {

        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        const User = verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw error

        const { name } = await req.json();
        const input = gudangBoard.safeParse({ name });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });

        const proses = prisma.$transaction(async (tx) => {

            const isAlreadyExists = await tx.warehouseCupBoard.findUnique({
                where: {
                    name: input.data.name
                }
            })
            if (isAlreadyExists) return new Error("Board telah ada !");

            const Board = await tx.warehouseCupBoard.create({
                data: { name: input.data.name }
            });

            return Board;
        });
        if (proses instanceof Error) return NextResponse.json({ status: false, msg: proses.message });
        return NextResponse.json({ status: true, data: proses });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

export async function POST(req: NextResponse) {
    try {

        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        const User = verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw error

        const { id, name } = await req.json();
        const input = gudangBoardUpdate.safeParse({ name, id });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });

        const proses = prisma.$transaction(async (tx) => {

            const isExists = await tx.warehouseCupBoard.findUnique({
                where: {
                    id: input.data.id
                }
            });

            if (!isExists) return new Error("Board tidak ditemukan!");

            const Board = await tx.warehouseCupBoard.update({
                where: { id: input.data.id },
                data: { name: input.data.name }
            });

            return Board;
        });
        if (proses instanceof Error) return NextResponse.json({ status: false, msg: proses.message });
        return NextResponse.json({ status: true, data: proses });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

export async function DELETE(req: NextResponse) {
    try {

        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        const User = verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw error

        const { name } = await req.json();
        const input = gudangBoard.safeParse({ name });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });

        const proses = prisma.$transaction(async (tx) => {

            const isAlreadyExists = await tx.warehouseCupBoard.findUnique({
                where: {
                    name: input.data.name
                }
            })
            if (!isAlreadyExists) return new Error("Board tidak ditemukan !");

            const Board = await tx.warehouseCupBoard.delete({
                where: { name: input.data.name }
            });

            return Board;
        });

        if (proses instanceof Error) return NextResponse.json({ status: false, msg: proses.message });
        return NextResponse.json({ status: true, data: proses });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}