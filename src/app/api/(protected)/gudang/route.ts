import prisma from "@/utils/db";
import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { gudangItem } from "@/utils/validation";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const cookie = await cookies();
        const Token = cookie.get("Auth")?.value;
        if (!Token) return NextResponse.json({ status: false, msg: ksr_status.token_invalid });
        const User = verifyTokenJWT(Token);
        // Jika token tidak valid maka akan throw error

        const { limit, page } = await req.json();
        const input = gudangItem.safeParse({ limit, page });
        if (!input.success) return NextResponse.json({ status: false, msg: JSON.parse(input.error.message) });

        const Board = await prisma.warehouseCupBoard.findMany({
            take: input.data.limit,
            skip: input.data.limit * input.data.page - input.data.limit,
            orderBy: {
                name: "asc"// Mengurutkan dari terkecil ke terbesar Contoh (a,b,c,d,...)
            }
        });

        return NextResponse.json({ status: true, data: Board });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}