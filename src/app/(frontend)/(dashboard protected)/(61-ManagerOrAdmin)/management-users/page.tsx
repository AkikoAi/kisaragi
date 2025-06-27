"use server";

import Unauthorized from "./src/app/(frontend)/(unprotected)/(error)/unauthorized/Unauthorized";
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