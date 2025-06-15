import prisma from "@/utils/db";
import { checkPassword, signTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { LoginValidation } from "@/utils/validation";
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const { username, password } = await req.json();

        // Melakukan validasi username dan password
        const ResValidation = LoginValidation.safeParse({ username, password })
        if (!ResValidation.success) return NextResponse.json({
            status: false,
            msg: JSON.parse(ResValidation.error.message)
        });

        // mencari username
        const userData = await prisma.user.findUnique({
            where: { username }, select:
                { id: true, password: true, username: true, name: true, role: true }
        })
        if (!userData) return NextResponse.json({ status: false, msg: ksr_status.user_not_found });

        const isValidPassword = await checkPassword(userData.password, password);
        if (!isValidPassword) return NextResponse.json({ status: false, msg: ksr_status.pass_incorrect });

        const cookie = await cookies();
        const token = signTokenJWT(userData)
        cookie.set("Auth", token, { httpOnly: true });

        return NextResponse.json({ status: true, data: "OK" });
    } catch (e) {
        addLogsFE(e)
        return NextResponse.json({ status: false, msg: ksr_status[500] })
    }
}