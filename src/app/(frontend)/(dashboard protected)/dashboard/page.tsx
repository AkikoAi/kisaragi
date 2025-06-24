
import { Metadata } from "next";
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