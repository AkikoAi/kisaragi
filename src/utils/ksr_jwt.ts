/**
 const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, 'your-secret-key');
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;
 */

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import ksr_status from "./ksr_status"

const secret = "FOX CAME WITH TWO, ARE SENKO AND KUSOGAKI"

/**
 * privilege 
| Level Range | Dibagi Oleh         | Privilege                  | Contoh Keterangan                       |
| ----------- | ------------------- | -------------------------- | --------------------------------------- |
| 1–10        | %2==0 (Genap)       | **Guest / Public**         | Bisa lihat data umum                    |
| 11–30       | %3==0 (Kelipatan 3) | **User**                   | Bisa baca dan ubah data diri sendiri    |
| 31–60       | %5==0 (Kelipatan 5) | **Supervisor / Moderator** | Bisa kelola data sebagian user          |
| 61–90       | %7==0 (Kelipatan 7) | **Manager / Admin**        | Bisa kelola seluruh data                |
| 91–100      | All angka           | **Super Admin / Owner**    | Akses penuh, termasuk pengaturan sistem |

 */
export type verifyToken = {
    username: string;
    password: string;
    id: string;
    name: string;
    role: string;
    privilege: number;
};

export function verifyTokenJWT(token: string) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded as verifyToken
    } catch (e) {
        throw ksr_status[401]
    }
}

export function signTokenJWT(data: any, exp?: number) {
    try {
        const encoded = jwt.sign(data, secret, { expiresIn: exp || "1h" });
        return encoded;
    } catch (e) {
        throw ksr_status[500]
    }
}

export function checkPassword(encrypted: string, password: string) {
    return bcrypt.compare(password, encrypted);
}

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}