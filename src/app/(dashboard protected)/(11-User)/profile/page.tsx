import { Metadata } from "next"
import Profile from "./profile"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyTokenJWT } from "@/utils/ksr_jwt";

export const metadata: Metadata = {
    title: "Profil Pengguna"
}

export default async function Page() {
    try {

        const cookie = await cookies();
        const token = cookie.get("Auth")?.value;
        if (!token) throw null;
        const data = verifyTokenJWT(token);

        return (
            <>
                <Profile User={data} />
            </>)

    } catch (e) {
        return redirect("/login");
    }
}