//"use server";

import React from "react";
import { Metadata } from "next";
import Register from "./register";


export const metadata: Metadata = {
    title: "Register"
}

export default async function Page() {
    return (<>
        <Register />
        {/* Footer Note */}
        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">© 2025 Kisaragi. All rights reserved.</p>
    </>)
}