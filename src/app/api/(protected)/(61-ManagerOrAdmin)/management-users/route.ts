import prisma from "@/utils/db";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { deleteUser, updateUser, userSearch } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import DataAccessLayer from "../../DataAccessLayer";

export async function POST(req: NextRequest) {
    const data = await DataAccessLayer();
    if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

    try {
        const { username, isVerified, privilege, name, email, newUsername } = await req.json();
        const validationResult = updateUser.safeParse({ username, isVerified, privilege, name, email, newUsername });
        if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });
        if (data.privilege < 91 && validationResult.data.privilege >= 61) {
            // privilege bukanlah super admin
            // User memberikan privilege lebih besar dari dirinya
            return NextResponse.json({ status: false, msg: ksr_status.privilege_escalation_attempt });
        }

        const updateResult = await prisma.user.update({
            where: {
                ...(data.privilege < 91 ? {
                    privilege: {
                        lt: 61
                    }
                } : {}), username: validationResult.data.username
            },
            data: {
                isVerified: validationResult.data.isVerified,
                privilege: validationResult.data.privilege,
                name: validationResult.data.name,
                email: validationResult.data.email,
                ...(validationResult.data.newUsername ? { username: validationResult.data.newUsername } : {})
            }
        });

        return NextResponse.json({ status: true, data: updateResult });
    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

export async function DELETE(req: NextRequest) {
    const data = await DataAccessLayer();

    // Jika Privilage bukan ManagerOrAdmin
    if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

    try {
        const { username, action } = await req.json();
        const validationResult = deleteUser.safeParse({ username, action });
        if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });

        const updateResult = await prisma.user.update({
            where: {
                ...(data.privilege < 91 ? {
                    privilege: {
                        lt: 61
                    }
                } : {}),
                username: validationResult.data.username
            },
            data: {
                isDeleted: validationResult.data.action == "delete"
            }
        });

        return NextResponse.json({ status: true, data: updateResult });

    } catch (e) {
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}

export async function GET(req: NextRequest) {
    const data = await DataAccessLayer();
    // Jika Privilage bukan ManagerOrAdmin
    if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username") || undefined;
        const limit = Number(searchParams.get("limit"));
        const page = Number(searchParams.get("page"));
        const validationResult = userSearch.safeParse({ username, limit, page });
        if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });
        const users = await prisma.user.findMany({
            where: {
                ...(data.privilege < 91 ? {
                    privilege: {
                        lt: 61
                    }
                } : {}),
                ...(validationResult.data.username ? {
                    username: validationResult.data.username
                } : {})
            },
            take: validationResult.data.limit,
            skip: (validationResult.data.page - 1) * validationResult.data.limit
        });

        return NextResponse.json({ status: true, data: users });
    } catch (e) {
        console.log(e);
        addLogsFE(e);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}