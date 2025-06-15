import prisma from "@/utils/db";
import { checkPassword, hashPassword, signTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { RegisterValidation } from "@/utils/validation";
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const data = await prisma.user.findMany();
    return NextResponse.json({ status: true, data });
}

export async function POST(req: NextRequest) {
    try {

        const { name, username, password, confirmPassword } = await req.json();

        // Melakukan validasi username dan password
        const ResValidation = RegisterValidation.safeParse({ name, username, password, confirmPassword });
        if (!ResValidation.success) return NextResponse.json({
            status: false,
            msg: JSON.parse(ResValidation.error.message)
        });

        // memeriksa username
        const isUsernameAlreadyUsed = await prisma.user.count({ where: { username: ResValidation.data.username } });
        if (isUsernameAlreadyUsed != 0) return NextResponse.json({ status: false, msg: ksr_status.username_already_user });

        // Melakukan Hash password
        const hashedPassword = await hashPassword(ResValidation.data.password);

        // Mendaftarkan user
        const transaksi = await prisma.$transaction(async (tx) => {
            const createUser = await tx.user.create({
                data: {
                    username: ResValidation.data.username,
                    password: hashedPassword,
                    name: ResValidation.data.name
                }
            });

            const createProfile = await tx.profile.create({
                data: {
                    id: createUser.username
                }
            });

            return { id: createUser.id, username: createUser.username, password: createUser.password, name: createUser.name, role: createUser.role, privilege: createUser.privilege };
        });

        const cookie = await cookies();
        const token = signTokenJWT(transaksi);
        cookie.set("Auth", token, { httpOnly: true });

        return NextResponse.json({ status: true, data: "OK" });
    } catch (e) {
        addLogsFE(e)
        return NextResponse.json({ status: false, msg: ksr_status[500] })
    }
}