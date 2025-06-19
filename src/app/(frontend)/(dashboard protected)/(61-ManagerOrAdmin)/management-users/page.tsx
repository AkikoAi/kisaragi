"use server";
import Unauthorized from "@/app/(frontend)/(unprotected)/(error)/unauthorized/Unauthorized";
import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { Metadata } from "next"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ManagementUsers from "./ManagementUsers";
import DataAccessLayer from "../../../../../utils/DataAccessLayer";

/**
export const metadata: Metadata = {
    title: "User Management"
}
 */

export default async function Page() {
    const data = await DataAccessLayer();
    if (data.privilege < 61) return <div className="mt-10"><Unauthorized /></div>

    return (<>
        <ManagementUsers />
    </>)
}