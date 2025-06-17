"server-only";

import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DataAccessLayer() {
    try {

        const auth = (await cookies()).get("Auth")?.value;
        if (!auth) return redirect("/login");
        const data = verifyTokenJWT(auth);
        return data
    } catch (e) {
        return redirect("/login");
    }
}