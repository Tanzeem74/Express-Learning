import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Iauth } from "./auth.interface"
import config from "../../config";

const loginUserIntoDB = async (payload: Iauth) => {
    const { email, password } = payload;
    const userData = await pool.query(`
        SELECT * FROM users
        WHERE email=$1
        `, [email])
    if (userData.rows.length === 0) {
        throw new Error('User not exist')
    }
    const user = userData.rows[0]
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log(matchPassword);
    if (!matchPassword) {
        throw new Error('User not exist');
    }

    const jwtpayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        email: user.email
    }
    const accessToken = jwt.sign(jwtpayload, config.secret as string, {
        expiresIn: "1d"
    });
    const refreshToken = jwt.sign(jwtpayload, config.refresh_secret as string, {
        expiresIn: "10d"
    });
    return { accessToken, refreshToken }
}

const generateRefreshToken = async (token: String) => {
    if (!token) {
        throw new Error('Unauthorized !!!')
    }
    const decoded = jwt.verify(token as string, config.refresh_secret as string) as JwtPayload;
    // console.log(decoded);
    const userData = await pool.query(`
            SELECT * FROM users
            WHERE email=$1
            `, [decoded.email])
    const user = userData.rows[0];
    if (userData.rows.length === 0) {
        throw new Error('User not found !!!')
    }
    if (!user.is_active) {
        throw new Error('Forbidden !!!')
    }
    const jwtpayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        email: user.email
    }
    const accessToken = jwt.sign(jwtpayload, config.secret as string, {
        expiresIn: "1d"
    });
    return {
        accessToken
    }
}


export const authService = {
    loginUserIntoDB,
    generateRefreshToken
}