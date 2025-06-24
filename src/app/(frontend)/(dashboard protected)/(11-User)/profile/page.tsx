
import DataAccessLayer from "@/utils/DataAccessLayer";
import Profile from "./profile";
import { Metadata } from "next";
import Unauthorized from "@/app/(frontend)/(unprotected)/(error)/unauthorized/Unauthorized";

export const metadata: Metadata = {
    title: "Profile"
}

export default async function ProfilePage() {
    const data = await DataAccessLayer();
    if (data.privilege < 11) return <div className="mt-10"><Unauthorized /></div>
    return (
        <>
            <Profile data={data} />
        </>
    );
}
