import { Metadata } from "next";
import Unauthorized from "./Unauthorized";

export const metadata: Metadata = {
    title: "Akses Dilarang"
}

export default async function Page() {
    return (<><Unauthorized /></>)
}