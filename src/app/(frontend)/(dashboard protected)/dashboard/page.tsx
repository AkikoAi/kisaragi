import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaCrown } from "react-icons/fa";
import Dashboard91 from "./Dashboard-91";
import Dashboard61 from "./Dashboard-61";
import DataAccessLayer from "../../../../utils/DataAccessLayer";


export const metadata: Metadata = {
    title: "Dashboard"
}

export default async function Page() {
    const data = await DataAccessLayer();

    return (<>
        {data.privilege >= 91 && <Dashboard91 />}
        {data.privilege >= 61 && <Dashboard61 />}
    </>)
}