import { z } from "zod/v4";

export const LoginValidation = z.object({
    username: z.string("Fubuki bilang input harus string, jangan angin-anginan!").min(3, "Kurokami Fubuki marah: Username minimal 3 karakter!").trim(),
    password: z.string("Fubuki bingung... password bukan string?").min(8, "Shirakami: Passwordnya jangan pendek-pendek dong~ minimal 8 ya!").trim()
});

export const RegisterValidation = LoginValidation.extend({
    name: z.string("Fubuki nyeletuk: Nama harus teks ya, bukan suara angin!").min(3, "Kurokami: Nama minimal 3 huruf, jangan cuman 'a'!").trim(),
    confirmPassword: z.string("Shirakami: Konfirmasi password harus string juga loh~").min(8, "Password konfirmasi juga minimal 8 karakter ya, Fubuki udah ngitung nih!").trim()
}).check((ctx) => {
    if (ctx.value.password != ctx.value.confirmPassword) {
        ctx.issues.push({
            code: "custom",
            path: ["confirmPassword"],
            message: "Kurokami: Password dan konfirmasi nggak sama nih, mau bikin Fubuki bingung ya?",
            input: ctx.value
        });
    }
});

export const ChangePasswordValidation = z.object({
    oldPassword: z.string("Fubuki nyengir: Password lama harus teks, jangan suara angin~").trim(),
    newPassword: z.string("Password baru juga teks dong, kata Shirakami!").trim(),
    confirmNewPassword: z.string("Konfirmasi password barunya juga teks yaa, Kurokami ngeliatin~").trim()
}).check((ctx) => {
    if (ctx.value.newPassword != ctx.value.confirmNewPassword) {
        ctx.issues.push({
            code: "custom",
            path: ["confirmNewPassword"],
            message: "Wah Shirakami dan Kurokami bingung... Password baru nggak sama nih!",
            input: ctx.value
        });
    }
});

export const gudangItemBaru = z.object({
    name: z.string("Fubuki bilang: Nama item harus berupa teks yaa~").min(3, "Nama item minimal 3 karakter dong, kata Shirakami!").trim(),
    description: z.string("Deskripsi harus string juga ya... Kurokami mengawasi!").trim(),
    expired: z.date("Tanggal kadaluarsa harus valid, jangan tanggal dari dunia lain!").optional(),
    cupBoardId: z.string("Fubuki nggak paham... ID harus string ya~").min(8, "ID lemari minimal 8 karakter, kata Kurokami!").trim()
});

export const gudangItemUpdate = gudangItemBaru.extend({
    ItemId: z.string("ID item harus string, jangan imajinasi Fubuki!").min(8, "ID item minimal 8 karakter, Kurokami nggak terima kalo kurang!").trim()
});

export const gudangItemDelete = z.object({
    ItemId: z.string("Fubuki bisik: ID harus teks lho~").min(8, "Kurokami: ID item harus minimal 8 karakter, jangan lupa ya!").trim()
});

export const gudangItem = z.object({
    page: z.number("Nomor halaman harus angka yaa, bukan harapan kosong...").gte(1, "Halaman mulai dari 1, kata Shirakami~"),
    limit: z.number("Limit data harus angka juga~").gte(10, "Minimal 10 item biar Fubuki nggak bingung~").lte(100, "Maksimal 100 item ya, Kurokami udah ngitung!"),
    search: z.string("Keyword pencarian harus string lho~").min(3, "Minimal 3 karakter dong, masa nyari 'a'?").trim().optional()
});


export const gudangBoard = z.object({
    name: z.string("Nama board harus string, jangan kode rahasia Fubuki!").min(3, "Minimal 3 huruf ya... Kurokami bisa marah kalau kurang!").trim()
});

export const gudangBoardUpdate = gudangBoard.extend({
    id: z.string("ID board harus string juga dong~").min(8, "ID board minimal 8 karakter ya, biar Kurokami bisa baca!").trim()
});

export const userSearch = z.object({
    page: z.number("Nomor halaman harus angka lho, Fubuki nggak bisa baca angin!").gte(1, "Halaman dimulai dari 1 yaa~"),
    limit: z.number("Limit harus angka juga ya").gte(10, "Minimal tampilkan 10 data biar Kurokami puas!").lte(100, "Jangan lebih dari 100, nanti Fubuki capek!"),
    username: z.string("Username cariannya harus string dong!").min(3, "Minimal 3 karakter, jangan nyari 'x' doang ya!").trim().optional()
});


const deleteUserActionEnum = ["restore", "delete"];
export const deleteUser = z.object({
    username: z.string("Username harus teks, jangan nama angin~").min(3, "Minimal 3 karakter ya, kata Shirakami!").trim(),
    action: z.string("Action harus string, jangan cuma bayangan!").trim().toLowerCase(),
}).check((ctx) => {
    if (!deleteUserActionEnum.includes(ctx.value.action)) {
        ctx.issues.push({
            code: "custom",
            path: ["action"],
            message: "Kurokami: Action nggak jelas... Cuma boleh 'restore' atau 'delete' ya!",
            input: ctx.value
        });
    }
});


export const updateUser = z.object({
    email: z.email("Fubuki: Email harus valid yaa, jangan email di alam mimpi!").trim().optional().nullable(),
    avatarUrl: z.url("URL avatar harus valid dong, jangan URL Fubuki palsu!").trim().optional().nullable(),
    name: z.string("Nama harus teks, Fubuki mau tahu juga~").min(3, "Nama minimal 3 huruf yaa, Shirakami udah nunggu!").trim(),
    username: z.string("Username harus teks!").min(3, "Minimal 3 huruf, jangan 'x' doang ya!").trim(),
    newUsername: z.string("New username juga string dong!").min(3, "Minimal 3 huruf biar Kurokami suka!").trim().optional(),
    isVerified: z.boolean("Harus boolean, bukan harapan palsu ya!"),
    role: z.string("Role harus string!").min(3, "Nama role minimal 3 huruf, Kurokami marah kalau asal!").trim(),
    privilege: z.number("Privilege harus angka ya, jangan dusta!").gte(1, "Minimal 1 yaa, Fubuki nyatet nih~").lte(100, "Maksimal 100 lho, jangan lebih dari Superadmin!")
});


export const profilePost = z.object({
    avatarUrl: z.url("URL avatar harus valid dong, jangan URL Fubuki palsu!").trim().optional().nullable(),
    email: z.email("Email harus valid, Fubuki nggak bisa kirim pesan ke dimensi lain!").trim().optional().nullable(),
    name: z.string("Nama wajib teks biar Shirakami bisa panggil!").min(3, "Minimal 3 huruf dong, jangan bikin Kurokami kecewa!").trim()
});
