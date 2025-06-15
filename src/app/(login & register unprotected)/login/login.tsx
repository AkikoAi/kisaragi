"use client";

import { useState } from "react";

export default function Login() {
    //const password = document.querySelector("input#password");
    //const username = document.querySelector("input#username");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messageError, setMessageError] = useState("");


    async function submit() {
        if (!username || !password) return setMessageError(`${username ? "Username" : "Password"} tidak boleh kosong`);
        fetch("/api/login", {
            method: "post",
            body: JSON.stringify({
                username, password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json()).then(r => {
            if (!r.status) return setMessageError(r.msg[0]?.message||r.msg)
            return document.location.href = "/dashboard";
        }).catch(e => {
            setMessageError("Gagal mengirim form ke server");
        });

    }

    return (<>
        {messageError && <p className="text-red-600 border-yellow-400">{messageError}</p>}
        <input className="border-black border-2" type="text" name="username" id="username" onChange={(v) => setUsername(v.currentTarget.value)} required />
        <input className="border-black border-2" type="password" name="password" id="password" onChange={(v) => setPassword(v.currentTarget.value)} required />
        <button type="button" onClick={submit}>LOGIN</button>
    </>)
}