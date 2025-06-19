"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [terms, setTerms] = useState<Boolean>(false);
    const [seePassword, setSeePassword] = useState<Boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    //const [messageError, setMessageError] = useState("");

    function seePasswordAction() {
        setSeePassword((prev) => !prev);
    }

    async function daftar(e: React.FormEvent) {
        e.preventDefault();
        if (!terms) return alert("Anda harus menyetujui syarat dan ketentuan dari menjadi kisaragi employee");
        fetch("/api/register", {
            method: "post",
            body: JSON.stringify({ username, password, name, confirmPassword }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json()).then(r => {
            if (!r.status) return alert(r.msg[0]?.message || r.msg);
            return window.location.href = "/login";
        }).catch(e => {
            return alert("Gagal mengirim form ke server");
        });
    }
    return (<>
        <div className="text-center mt-10">
            <h1 className="text-2xl">Daftar</h1>
            <small className="italic">Kisaragi obfuscated organization system </small>
        </div>

        <div className="flex justify-center">
            <form className="mt-10 w-[90%] max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4" onSubmit={daftar}>
                {/* Text Input */}
                <div>
                    <label htmlFor="username" className="block mb-1 font-medium">
                        Username
                    </label>
                    <input
                        required
                        id="username"
                        type="text"
                        onChange={(r) => setUsername(r.currentTarget.value)}
                        placeholder="Enter your username employee"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block mb-1 font-medium">
                        Name
                    </label>
                    <input
                        required
                        id="name"
                        type="text"
                        onChange={(r) => setName(r.currentTarget.value)}
                        placeholder="Enter your name employee"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            required
                            id="password"
                            type={!seePassword ? "password" : "text"}
                            onChange={(r) => setPassword(r.currentTarget.value)}
                            placeholder="••••••••"
                            className="pr-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>

                    <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 flex items-center right-3 text-gray-400 cursor-pointer"
                            onClick={seePasswordAction}>
                            {!seePassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                        </span>
                        <input
                            required
                            id="confirmPassword"
                            type={!seePassword ? "password" : "text"}
                            onChange={(r) => setConfirmPassword(r.currentTarget.value)}
                            placeholder="••••••••"
                            className="pr-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Daftar
                </button>
            </form>
        </div>
    </>)
}