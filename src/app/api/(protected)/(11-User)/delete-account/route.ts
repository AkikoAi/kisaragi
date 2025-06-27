import DataAccessLayer from "@/utils/DataAccessLayer";
import prisma from "@/utils/db";
import { checkPassword } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { deleteAccount } from "@/utils/validation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const data = await DataAccessLayer();
        if (data.privilege < 11) return NextResponse.json({ status: false, msg: ksr_status[403] });

        const body = await req.formData();
        const validationResult = deleteAccount.safeParse({
            username: body.get("username"),
            password: body.get("password"),
            confirmText: body.get("confirmText")
        });
        if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });

        const passwordResult = await checkPassword(data.password, validationResult.data.password);
        if (!passwordResult) return NextResponse.json({ status: false, msg: ksr_status.oldpass_not_same })

        await prisma.user.update({
            where: {
                id: data.id,
                username: validationResult.data.username
            },
            data: {
                isDeleted: true
            }
        });

        return NextResponse.json({ status: true, data: ksr_status.success_delete_account });

    } catch (error) {
        const err = error as PrismaClientKnownRequestError;
        if (err.code === 'P2025') {
            return NextResponse.json({
                status: false,
                msg: "Eh?! Data user-nya nggak ketemu Fubuki-chan... jangan-jangan user ini udah menghilang seperti ninja!"
            });
        }
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}