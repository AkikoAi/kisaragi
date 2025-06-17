import prisma from "@/utils/db";
import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { deleteUser, updateUser, userSearch } from "@/utils/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);
        if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

        try {
            const { username, isVerified, privilege } = await req.json();
            const validationResult = updateUser.safeParse({ username, isVerified, privilege });
            if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });
            if (data.privilege < 91 && validationResult.data.privilege >= 61) {
                // privilege bukanlah super admin
                // User memberikan privilege lebih besar dari dirinya
                console.log("Gate ajkqwerqj", data.privilege, validationResult.data.privilege);
                return NextResponse.json({ status: false, msg: ksr_status.privilege_escalation_attempt });
            }

            const updateResult = await prisma.user.update({
                where: { username: validationResult.data.username },
                data: {
                    isVerified: validationResult.data.isVerified,
                    privilege: validationResult.data.privilege
                }
            });

            return NextResponse.json({ status: true, data: updateResult });
        } catch (error) {
            addLogsFE(error);
            return NextResponse.json({ status: false, msg: ksr_status[500] });
        }


    } catch (e) {
        return redirect("/login");
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);

        // Jika Privilage bukan ManagerOrAdmin
        if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

        try {
            const { username, action } = await req.json();
            const validationResult = deleteUser.safeParse({ username, action });
            if (!validationResult.success) return NextResponse.json({ status: false, msg: JSON.parse(validationResult.error.message) });

            const updateResult = await prisma.user.update({
                where: {
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

    } catch (e) {
        return redirect("/login");
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);

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
                    ...(data.privilege < 61 ? {
                        privilege: {
                            lt: 61
                        }
                    } : {}),
                    ...(validationResult.data.username ? {
                        username: validationResult.data.username
                    } : {})
                },
                take: validationResult.data.limit,
                skip: validationResult.data.limit * validationResult.data.page - validationResult.data.limit
            });

            return NextResponse.json({ status: true, data: users });
        } catch (e) {
            console.log(e);
            addLogsFE(e);
            return NextResponse.json({ status: false, msg: ksr_status[500] });
        }

    } catch (e) {
        return redirect("/login");
    }
}