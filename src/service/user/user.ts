import {SignupRequest} from '../../handler/user/sinup'
import {dbClient} from '../../db/client'
import {SigninRequest} from '../../handler/user/signin'
import jwt from 'jsonwebtoken'
import {jwtSecret} from '../../config/props'
import {checkPassword, hashPassword} from './hash'
import {BadRequestError} from '../../handler/error/error'

export async function createUser(user: SignupRequest): Promise<UserEntity> {
    const newUser: UserEntity = {
        id: null,
        login: user.login,
        password: await hashPassword(user.passwd),
        createdAt: new Date(),
        updatedAt: null,
        balance: 0,
        producer: false,
    }
    const ids = await dbClient('user').insert(newUser).returning('id')
    return {
        ...newUser,
        id: ids[0],
    }
}

export async function login(request: SigninRequest): Promise<string> {
    const user = await dbClient<UserEntity>('user')
		.where('login', '=', request.login)
		.first()
    if (!user || !(await checkPassword(request.password, user.password))) {
        throw new BadRequestError('Invalid credentials')
    }
    const payload = {
        id: user.id,
        login: user.login,
    }
    return jwt.sign(payload, jwtSecret)
}

export async function existsByLogin(login: String): Promise<boolean> {
	const user = await dbClient<UserEntity>('user')
		.where('login', login)
		.first();
	return !(!user)

}

export interface UserEntity {
    id: number | null,
    login: string,
    password: string,
    balance: number,
    producer: boolean,
    createdAt: Date,
    updatedAt: Date | null,
}

export interface UserInfo {
    id: number,
    login: string,
}