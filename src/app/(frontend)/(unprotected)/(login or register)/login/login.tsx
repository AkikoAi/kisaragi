"use client";

import  { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    //const password = document.querySelector("input#password");
    //const username = document.querySelector("input#username");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [terms, setTerms] = useState<boolean>(false);
    const [seePassword, setSeePassword] = useState<boolean>(false);

    function seePasswordAction() {
        setSeePassword((prev) => !prev);
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        if (!terms) return alert("Kamu harus menyetujui persyaratan dan resiko pekerja");
        if (!username || !password) return alert(`${username ? "Username" : "Password"} tidak boleh kosong`);
        fetch("/api/login", {
            method: "post",
            body: JSON.stringify({
                username, password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json()).then(r => {
            if (!r.status) return alert(r.msg[0]?.message || r.msg)
            return document.location.href = "/dashboard";
        }).catch(() => {
            alert("Gagal mengirim form ke server");
        });

    }

    return (<>

        <div className="text-center mt-10">
            <h1 className="text-2xl">Login</h1>
            <small className="italic">Kisaragi obfuscated organization system </small>
        </div>
        <div className="flex justify-center">
            <form className="mt-10 w-[90%] max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4" onSubmit={submit}>
                {/* Text Input */}
                <div>
                    <label htmlFor="name" className="block mb-1 font-medium">
                        Username
                    </label>
                    <input
                        id="name"
                        type="text"
                        onChange={(r) => setUsername(r.currentTarget.value)}
                        placeholder="Enter your username employee"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Password Input */}
                <div>

                    <label htmlFor="password" className="block mb-1 font-medium">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 flex items-center right-3 text-gray-400 cursor-pointer"
                            onClick={seePasswordAction}>
                            {!seePassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                        </span>
                        <input
                            id="password"
                            type={!seePassword ? "password" : "text"}
                            onChange={(r) => setPassword(r.currentTarget.value)}
                            placeholder="••••••••"
                            className="pr-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center space-x-2">
                    <input
                        id="terms"
                        onChange={(r) => { setTerms(r.currentTarget.checked) }}
                        checked={!!terms}
                        type="checkbox"
                        className="accent-blue-600 w-4 h-4"
                    />
                    <label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </form>
        </div>
    </>)
}