
import { Metadata } from "next";
import Dashboard91 from "./Dashboard-91";
import Dashboard61 from "./Dashboard-61";
import DataAccessLayer from "./src/utils/DataAccessLayer";
import AbsenCard from "./src/components/Dashboard-Absen";


export const metadata: Metadata = {
    title: "Dashboard"
}

export default async function Page() {
    const data = await DataAccessLayer();

    return (
        <>
            <AbsenCard />
            {
                data.privilege >= 91 ? <Dashboard91 /> :
                    data.privilege >= 61 ? <Dashboard61 /> :
                        <div className="p-4 text-center">Anda tidak memiliki akses ke halaman ini</div>
            }
        </>
    )
}