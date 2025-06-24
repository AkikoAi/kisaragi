//"use server";

import { Metadata } from "next";

import Login from "./login";

export const metadata: Metadata = {
    title: "Login"
}

export default async function Page() {
    return (<>
        <Login />
        {/* Footer Note */}
        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">© 2025 Kisaragi. All rights reserved.</p>
    </>)
}