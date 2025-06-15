"use server"

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "./(Layout)/Navigation";


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    /*
    const cookie = await cookies();
    const auth = cookie.get("Auth")?.value;
    if (!auth) return redirect("/login");
    */
    return (<>
        
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6">
                {children}
            </main>

    </>)
}