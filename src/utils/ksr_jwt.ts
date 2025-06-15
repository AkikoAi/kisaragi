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

export type verifyToken = {
    username: string;
    password: string;
    id: string;
    name: string;
    role: string;
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