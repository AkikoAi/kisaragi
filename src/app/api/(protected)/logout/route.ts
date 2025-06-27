import { verifyTokenJWT } from "./src/utils/ksr_jwt";
import { addLogsUser } from "./src/utils/ksr_logs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);

        addLogsUser(`${data.id} Logout`);
        cookie.delete("Auth");

        return redirect("/login");
    } catch {
        return redirect("/login");
    }
}
