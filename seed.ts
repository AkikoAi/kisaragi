import { hashPassword } from "@/utils/ksr_jwt";
import prisma from "./src/utils/db";

async function seed() {
    try {
        console.info("menambahkan seed")
        const pass = await hashPassword(process.env.ADMIN_PASSWORD || "12345678");
        const SUPERADMIN = await prisma.user.upsert({
            where: {
                username: process.env.ADMIN_USERNAME || "AkikoAi"
            },
            update: {
                password: pass,
                limit: 3
            },
            create: {
                username: process.env.ADMIN_USERNAME || "AkikoAi",
                password: pass,
                name: process.env.ADMIN_NAME || "Hadi Firmansya",
                email: process.env.ADMIN_EMAIL || "superadmin.akiko@kisaragi.id",
                privilege: 100,
                role: "superadmin"
            }
        });
        const ADMIN = await prisma.user.upsert({
            where: {
                username: "AkikoAi-Admin"
            },
            update: {
                password: pass,
                limit: 3
            },
            create: {
                username: "AkikoAi-Admin",
                password: pass,
                name: "Hadi Firmansya - Admin",
                email: "admin.akiko@kisaragi.id",
                privilege: 90,
                role: "admin"
            }
        });
        const MODERATOR = await prisma.user.upsert({
            where: {
                username: "AkikoAi-Moderator"
            },
            update: {
                password: pass,
                limit: 3
            },
            create: {
                username: "AkikoAi-Moderator",
                password: pass,
                name: "Hadi Firmansya - Moderator",
                email: "moderator.akiko@kisaragi.id",
                privilege: 60,
                role: "moderator"
            }
        });
        const USER = await prisma.user.upsert({
            where: {
                username: "AkikoAi-User"
            },
            update: {
                password: pass,
                limit: 3
            },
            create: {
                username: "AkikoAi-User",
                password: pass,
                name: "Hadi Firmansya - User",
                email: "user.akiko@kisaragi.id",
                privilege: 30,
                role: "user"
            }
        });
        console.info("Selesai melakukan seeder", ADMIN);
    } catch (e) {
        console.error("Gagal melakukan seeder", e);
    }
}
seed();