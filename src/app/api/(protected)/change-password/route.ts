import prisma from "@/utils/db";
import { checkPassword, hashPassword, verifyTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { ChangePasswordValidation } from "@/utils/validation";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const cookie = await cookies();
        const token = cookie.get("Auth")?.value;
        if (!token) return NextResponse.redirect(new URL("/login", req.url));

        const data = verifyTokenJWT(token);

        const { oldPassword, newPassword, confirmNewPassword } = await req.json();

        const validation = ChangePasswordValidation.safeParse({ oldPassword, newPassword, confirmNewPassword });
        if (!validation.success) return NextResponse.json({ status: false, msg: JSON.parse(validation.error.message) });

        console.log(data, validation);
        const isValidPassword = await checkPassword(data.password, validation.data.oldPassword);

        if (!isValidPassword) return NextResponse.json({ status: false, msg: ksr_status.oldpass_not_same });

        const hashedPassword = await hashPassword(newPassword);

        const changingPassword = await prisma.user.update({ where: { id: data.id }, data: { password: hashedPassword } });

        cookie.delete("Auth");
        return NextResponse.json({ status: true, data: ksr_status.success_change_password });
    } catch (e) {
        console.log(e)
        addLogsFE(e)
        return NextResponse.json({ status: false, msg: ksr_status[500] })
    }
}