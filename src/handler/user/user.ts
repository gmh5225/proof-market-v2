import {SignupRequest} from "./sinup";
import {dbClient} from "../../db/client";
import bcrypt from 'bcrypt';
import {SigninRequest} from "./signin";
import jwt from 'jsonwebtoken';
import {jwtSecret, saltRounds} from "../../config/props";
import {BadRequestError} from "../error/error";

export async function createUser(user: SignupRequest): Promise<UserEntity> {
    const newUser: UserEntity = {
        id: null,
        login: user.login,
        password: await hashPassword(user.passwd),
        createdAt: new Date(),
        updatedAt: null,
    }
    const ids = await dbClient('user').insert(newUser).returning('id')
    return {
        ...newUser,
        id: ids[0],
    }
}

export async function login(request: SigninRequest): Promise<string> {
    const user = await dbClient('user').where('login', '=', request.login).first();
    if (!user || !(await checkPassword(request.password, user.password))) {
        throw new BadRequestError('Invalid credentials');
    }
    const payload = {
        id: user.id,
        login: user.login
    };
    return jwt.sign(payload, jwtSecret);
}

async function hashPassword(password: string) {
    return await bcrypt.hash(password, saltRounds);
}

async function checkPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export interface UserEntity {
    id: number | null,
    login: string,
    password: string,
    createdAt: Date,
    updatedAt: Date | null,
}