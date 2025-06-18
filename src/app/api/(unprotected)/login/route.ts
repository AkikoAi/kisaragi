import prisma from "@/utils/db";
import { checkPassword, signTokenJWT } from "@/utils/ksr_jwt";
import { addLogsFE, addLogsUser } from "@/utils/ksr_logs";
import ksr_status from "@/utils/ksr_status";
import { LoginValidation } from "@/utils/validation";
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const { username, password } = await req.json();

        // Melakukan validasi username dan password
        const ResValidation = LoginValidation.safeParse({ username, password })
        if (!ResValidation.success) return {
            status: false,
            msg: JSON.parse(ResValidation.error.message)
        };

        // TRANSAKSI
        const transactionResult = await prisma.$transaction(async (tx) => {
            // mencari username
            const userData = await tx.user.findUnique({
                where: { username, isDeleted: false }, select:
                {
                    id: true, password: true, username: true, name: true, role: true, privilege: true, limit: true, isVerified: true,avatarUrl:true
                }
            })
            // Memeriksa apakah user ada?
            if (!userData) return { status: false, msg: ksr_status.user_not_found };
            // Memeriksa sisa percobaan user
            if (userData.limit <= 0) return { status: false, msg: ksr_status.login_limit_reached };

            // Memeriksa input password 
            const isValidPassword = await checkPassword(userData.password, password);
            if (!isValidPassword) {
                // Password tidak valid, mengurangi sisa percobaan
                const attempRemaining = userData.limit - 1;
                await tx.user.update({ where: { username }, data: { limit: attempRemaining } });
                addLogsUser(attempRemaining > 0 ? `${userData.username} Melakukan percobaan login, password salah sisa percobaan ${attempRemaining}` : `${userData.username} Seluruh percobaan login diblokir, tidak dapat melakukan login! *tidak berpengaruh ke session yang telah berjalan`);
                return { status: false, msg: ksr_status.pass_incorrect };
            }

            // Password valid, jika sisa percobaan kurang dari 3 maka reset kembali menjadi 3
            if (userData.limit < 3) await tx.user.update({ where: { username }, data: { limit: 3 } });

            // Jika user belum terverifikasi maka batalkan login
            if (!userData.isVerified) return { status: false, msg: ksr_status.user_not_verified };


            // Memfilter hanya data yang diperlukan saya
            const { limit, ...userDataFiltered } = userData;

            // Mengirim data yang diperlukan
            return { status: true, data: userDataFiltered };
        });
        // END TRANSAKSI

        // transaksi gagal atau data yang diperlukan tidak ada, maka kirim respon false
        if (!transactionResult.status || !transactionResult.data) return NextResponse.json(transactionResult);

        // data yang diperlukan ada, maka persiapkan token dan simpan di cookie
        addLogsUser(`${transactionResult.data.username} Berhasil login`);
        const token = signTokenJWT(transactionResult.data);
        const cookie = await cookies();
        cookie.set("Auth", token, { httpOnly: true });

        // Berhasil menyimpan cookie, mengirim respon OK
        return NextResponse.json({ status: true, data: "OK" });

    } catch (e) {
        addLogsFE(e)
        return NextResponse.json({ status: false, msg: ksr_status[500] })
    }
}