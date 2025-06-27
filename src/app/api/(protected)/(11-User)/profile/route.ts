import { Prisma } from "@/generated/prisma";
import DataAccessLayer from "@/utils/DataAccessLayer";
import prisma from "@/utils/db";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { profilePost } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const data = await DataAccessLayer();
        if (data.privilege < 11) return NextResponse.json({ status: false, msg: ksr_status[403] })

        const { email, name, avatarUrl } = await req.json();
        const validationResult = profilePost.safeParse({ email, name, avatarUrl });
        if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });
        // Mulai mengubah data
        await prisma.user.update({
            where: { id: data.id },
            data: {
                email: validationResult.data.email,
                name: validationResult.data.name,
                avatarUrl: validationResult.data.avatarUrl
            }
        });
        return NextResponse.json({ status: true, data: "Profile berhasil diubah" });
    } catch (error) {
        const err = error as Prisma.PrismaClientKnownRequestError;
        if (err.code === 'P2002') {
            return NextResponse.json({
                status: false,
                msg: `Ups! Ada data kembar nih Fubuki-chan! 😱 ${err.meta?.target} sudah digunakan!`,
            });
        }
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}