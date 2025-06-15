"use client";

import { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    //const [messageError, setMessageError] = useState("");

    async function daftar(e: React.FormEvent) {
        e.preventDefault();
        fetch("/api/register", {
            method: "post",
            body: JSON.stringify({ username, password, name, confirmPassword }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json()).then(r => {
            if (!r.status) return alert(r.msg[0]?.message || r.msg);
            return alert(r.msg);
        }).catch(e => {
            return alert("Gagal mengirim form ke server");
        });
    }
    return (<>
        <form onSubmit={daftar}>
            <input type="text" name="username" id="username" onChange={(e) => setUsername(e.currentTarget.value)} required />
            <input type="text" name="name" id="name" onChange={(e) => setName(e.currentTarget.value)} required />
            <input type="password" name="password" id="password" onChange={(e) => setPassword(e.currentTarget.value)} required />
            <input type="password" name="confirmPassword" id="confirmPassword" onChange={(e) => setConfirmPassword(e.currentTarget.value)} required />
            <button type="submit">Daftar</button>
        </form>
    </>)
}