import Application from "koa";
import {UnauthorizedError} from "../../handler/error/error";
import jwt from "jsonwebtoken";
import {jwtSecret, saltRounds} from "../../config/props";
import bcrypt from "bcrypt";

export function decodeJwt(request: Application.Request): UserInfo {
    const authToken = request.header['authorization'] as string | undefined;
    if (!authToken) {
        throw new UnauthorizedError("Token required")
    }
    const token = authToken.replace('Bearer ', '')
    jwt.verify(token, jwtSecret)
    const userInfo = jwt.decode(token, { json: true}) as UserInfo | null
    if (!userInfo) {
        throw new UnauthorizedError("Token invalid")
    }
    return userInfo
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, saltRounds)
}

export async function checkPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}

export interface UserInfo {
    id: number,
    login: string,
}