import DataAccessLayer from "./src/utils/DataAccessLayer";
import prisma from "./src/utils/db";
import { checkPassword, hashPassword } from "./src/utils/ksr_jwt";
import { addLogsFE } from "./src/utils/ksr_logs";
import ksr_status from "./src/utils/ksr_status";
import { ChangePasswordValidation } from "./src/utils/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await DataAccessLayer();
        if (data.privilege < 11) return NextResponse.json({ status: false, msg: ksr_status[403] });

        const body = await req.formData();
        const validationResult = ChangePasswordValidation.safeParse({
            oldPassword: body.get("oldPassword"),
            newPassword: body.get("newPassword"),
            confirmNewPassword: body.get("confirmNewPassword")
        });
        if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });

        const passwordResult = await checkPassword(data.password, validationResult.data.oldPassword);
        if (!passwordResult) return NextResponse.json({ status: false, msg: ksr_status.oldpass_not_same })

        const newHashPassword = await hashPassword(validationResult.data.newPassword);
        await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                password: newHashPassword,
                loginVersion: { increment: 1 }
            }
        });

        return NextResponse.json({ status: true, data: ksr_status.success_change_password });

    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}