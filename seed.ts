import { hashPassword } from "@/utils/ksr_jwt";
import prisma from "./src/utils/db";

async function seed() {
    try {
        console.info("menambahkan seed")
        const pass = await hashPassword(process.env.ADMIN_PASSWORD || "12345678");
        const ADMIN = await prisma.user.upsert({
            where: {
                username: process.env.ADMIN_USERNAME || "AkikoAi"
            },
            update: {
                password: pass
            },
            create: {
                username: process.env.ADMIN_USERNAME || "AkikoAi",
                password: pass,
                name: process.env.ADMIN_NAME || "Hadi Firmansya",
                email: process.env.ADMIN_EMAIL || "akiko@kisaragi.id",
                privilege: 100,
                role: "superadmin"
            }
        });
        console.info("Selesai melakukan seeder", ADMIN);
    } catch (e) {
        console.error("Gagal melakukan seeder", e);
    }
}
seed();