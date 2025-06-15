import { z } from "zod/v4";

export const LoginValidation = z.object({
    username: z.string("Input harus berupa string").trim(),
    password: z.string("Input harus berupa string").min(8, "Minimal harus 8 karakter").trim()
})

export const RegisterValidation = LoginValidation.extend({
    name: z.string("Input harus berupa string").min(3, "Nama tidak boleh kurang dari 3 huruf").trim(),
    confirmPassword: z.string("Input harus berupa string").min(8, "Minimal harus 8 karakter").trim()
}).check((ctx) => {
    if (ctx.value.password != ctx.value.confirmPassword) {
        ctx.issues.push({
            code: "custom",
            path: ["confirmPassword"],
            message: "password tidak sama",
            input: ctx.value
        });
    }
})

export const ChangePasswordValidation = z.object({
    oldPassword: z.string("Input password lama harus berupa string").trim(),
    newPassword: z.string("Input password lama harus berupa string").trim(),
    confirmNewPassword: z.string("Input password lama harus berupa string").trim()
}).check((ctx) => {
    if (ctx.value.newPassword != ctx.value.confirmNewPassword) {
        ctx.issues.push({
            code: "custom",
            path: ["confirmNewPassword"],
            message: "Password tidak sama",
            input: ctx.value
        })
    }
})

export const gudangItemBaru = z.object({
    name: z.string("Input harus berupa string").min(3, "Nama item minimal 3 karakter").trim(),
    description: z.string("Input harus berupa string").trim(),
    expired: z.date("Input harus berupa tanggal").optional(),
    cupBoardId: z.string("Input harus berupa string").trim()
});

export const gudangItemUpdate = gudangItemBaru.extend({
    ItemId: z.string("Input harus berupa string").min(8, "Id tidak valid").trim()
});

export const gudangItemDelete = z.object({
    ItemId: z.string("Input harus berupa string").min(8, "Id tidak valid").trim()
})

export const gudangItem = z.object({
    page: z.number("Input harus berupa number").gte(1, "Page paling kecil adalah 1"),
    limit: z.number("Input harus berupa number").gte(10, "Minimal data yang dapat ditampilkan adalah 10")
        .lte(100, "Maximal data yang dapat ditampilkan adalah 100")
})

export const gudangBoard = z.object({
    name:z.string("Input harus berupa string").min(3,"Nama board minmal 3 karakter")
})