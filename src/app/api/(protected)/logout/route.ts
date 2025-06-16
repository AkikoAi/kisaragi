import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { addLogsUser } from "@/utils/ksr_logs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);

        addLogsUser(`${data.username} Logout`);
        cookie.delete("Auth");

        return redirect("/login");
    } catch (e) {
        return redirect("/login");
    }
}