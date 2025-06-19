
import { addLogsFE } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { readFileSync } from "fs";
import { NextResponse } from "next/server";
import DataAccessLayer from "../../../../../utils/DataAccessLayer";


export async function GET() {
    const data = await DataAccessLayer();

    if (data.privilege < 61) return NextResponse.json({ status: false, msg: ksr_status.unauthorized });

    try {
        const file = readFileSync("src/logs/user.txt")
        return NextResponse.json({ status: true, data: file.toString("utf8").split('\n') });
    } catch (error) {
        addLogsFE(error);
        return NextResponse.json({ status: false, msg: ksr_status[500] });
    }
}