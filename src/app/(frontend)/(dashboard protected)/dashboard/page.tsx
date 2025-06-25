
import { Metadata } from "next";
import Dashboard91 from "./Dashboard-91";
import Dashboard61 from "./Dashboard-61";
import DataAccessLayer from "../../../../utils/DataAccessLayer";


export const metadata: Metadata = {
    title: "Dashboard"
}

export default async function Page() {
    const data = await DataAccessLayer();

    if (data.privilege >= 91) return <Dashboard91 />;
    if (data.privilege >= 61) return <Dashboard61 />;
    return <div className="p-4 text-center">Anda tidak memiliki akses ke halaman ini.</div>;
}