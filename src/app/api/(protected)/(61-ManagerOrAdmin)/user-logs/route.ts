import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { readFile, readFileSync } from "fs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);

        if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

        try {
            const file = readFileSync("src/logs/user.txt")
            return NextResponse.json({ status: true, data: file.toString("utf8").split('\n') });
        } catch (error) {
            addLogsFE(error);
            return NextResponse.json({ status: false, msg: ksr_status[500] });
        }
    } catch (e) {
        return redirect("/login");
    }
}