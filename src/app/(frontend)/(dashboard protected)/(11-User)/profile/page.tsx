import DataAccessLayer from "@/utils/DataAccessLayer";
import Profile from "./profile";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile"
}

export default async function ProfilePage() {
    const data = await DataAccessLayer();

    return (
        <>
            <Profile data={data} />
        </>
    );
}
