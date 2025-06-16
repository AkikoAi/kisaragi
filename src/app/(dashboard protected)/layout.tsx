"use server"

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "./(Layout)/Navigation";
import { verifyTokenJWT } from "@/utils/ksr_jwt";


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    try {

        const cookie = await cookies();
        const auth = cookie.get("Auth")?.value;
        if (!auth) return redirect("/login");
        const data = verifyTokenJWT(auth);

        return (<>

            <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
                <Navigation data={data} />
                <main className="flex-1 container mx-auto px-4 py-6">
                    {children}
                </main>
            </div>

        </>)
    } catch (e) {
        return redirect("/login");
    }
}