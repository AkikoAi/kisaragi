import Unauthorized from "@/app/(frontend)/(unprotected)/(error)/unauthorized/Unauthorized";
import DataAccessLayer from "@/utils/DataAccessLayer";
import { Metadata } from "next"
import AbsensiPage from "./Absen";

export const metadata: Metadata = {
    title: "Absensi Bulan Ini"
}

export default async function Page() {
    const data = await DataAccessLayer();
    if (data.privilege < 11) return <div className="mt-10"><Unauthorized /></div>
    return (<>
        <AbsensiPage />
    </>)
}