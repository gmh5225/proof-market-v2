import jwt from 'jsonwebtoken'
import {jwtSecret} from '../../config/props'
import {checkPassword, hashPassword} from './hash'
import {BadRequestError, UnauthorizedError} from '../../handler/error/error'
import {findById, findByLogin, insert, UserEntity} from '../../repository/user'
import {SignupRequest} from "../../route/UserController";

export async function createUser(user: SignupRequest): Promise<UserEntity> {
	const newUser: UserEntity = {
		id: undefined,
		login: user.user,
		password: await hashPassword(user.passwd),
		created_at: new Date(),
		updated_at: new Date(),
		balance: BigInt(0),
		producer: false,
		email: null,
	}
	return await insert(newUser)
}

export async function login(request: SigninRequest): Promise<AuthUser> {
	const user = await findByLogin(request.username)
	if (!user || !(await checkPassword(request.password, user.password))) {
		throw new UnauthorizedError('Invalid credentials')
	}
	const payload = {
		id: user.id,
		login: user.login,
	}
	return {
		id: user.id!,
		jwt: jwt.sign(payload, jwtSecret),
	}
}

export async function userDetails(userId: number): Promise<UserDetails> {
	const user = await findById(userId)
	if (!user) {
		throw new BadRequestError('User not found')
	}
	return {
		id: user.id!,
		login: user.login,
		balance: Number(user.balance),
		producer: user.producer,
		createdAt: user.created_at,
	}
}

export interface AuthUser {
    id: number,
    jwt: string,
}

export interface UserDetails {
    id: number,
    login: string,
    balance: number,
    producer: boolean,
    createdAt: Date,
}

export interface SigninRequest {
	username: string
	password: string
}
