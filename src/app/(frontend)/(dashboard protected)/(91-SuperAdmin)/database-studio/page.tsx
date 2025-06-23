import DataAccessLayer from "@/utils/DataAccessLayer";
import DatabaseStudio from "./DatabaseStudio";
import Unauthorized from "@/app/(frontend)/(unprotected)/(error)/unauthorized/Unauthorized";

export default async function Page() {
    const data = await DataAccessLayer();
    if (data.privilege < 91) return <div className="mt-10"><Unauthorized /></div>
    return (<><DatabaseStudio /></>)
}