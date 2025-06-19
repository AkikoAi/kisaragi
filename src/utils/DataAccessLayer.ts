"use server";

import { verifyTokenJWT } from "@/utils/ksr_jwt";
import { cookies } from "next/headers";
import { redirect, usePathname } from "next/navigation";
import prisma from "./db";

export default async function DataAccessLayer() {
    try {
        const auth = (await cookies()).get("Auth")?.value;
        if (!auth) return redirect("/login");
        const data = verifyTokenJWT(auth);
        // melakukan pemeriksaan data
        const User = await prisma.user.findUnique({
            where: { id: data.id }
        });
        if (User) {
            return User;
        }
        throw new Error("User tidak ditemukan atau authentikasi sudah tidak valid");
    } catch (e) {
        return redirect("/login");
    }
}