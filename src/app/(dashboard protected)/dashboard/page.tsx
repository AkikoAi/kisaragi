"use server";

import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const cookie = await cookies();
    const token = cookie.get("Auth")?.value as string;
    const data = verifyTokenJWT(token);

    return (<>
        Hello
        {Object.entries(data).map(([name, value]) => <p>{name} : {value}</p>)}
    </>)
}