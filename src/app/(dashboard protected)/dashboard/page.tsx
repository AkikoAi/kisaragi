import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaCrown } from "react-icons/fa";
import Dashboard90 from "./Dashboard-90";


export const metadata: Metadata = {
    title:"Dashboard"
}

export default async function Page() {
    try {
        const cookie = await cookies();
        const token = cookie.get("Auth")?.value as string;
        const data = verifyTokenJWT(token);


        if(data.privilege > 90) return <Dashboard90/>
        return (<>
        
            <p className="flex items-center gap-2">
                Hello {data.name} {data.privilege > 90 ? <FaCrown /> : <></>}
            </p>
            {Object.entries(data).map(([name, value]) => <p key={name}>{name} : {value}</p>)}
        </>)
    } catch (e) {
        return redirect("/login");
    }
}