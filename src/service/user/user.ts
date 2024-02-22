import jwt from 'jsonwebtoken'
import {jwtSecret} from '../../config/props'
import {BadRequestError} from '../../handler/error/error'
import {findByAddress, findById, insert, UserEntity} from '../../repository/user'
import {balance} from "../blockchain/client";

export async function authUser(
	address: string,
): Promise<AuthUser> {
	const userOpt = await findByAddress(address);
	if (!userOpt) {
		const saved = await insert({
			id: undefined,
			address: address,
			created_at: new Date(),
			producer: false,
		})
		console.log(`User created with address ${address}`)
		return {
			id: saved.id!,
			jwt: jwt.sign(userPayload(saved), jwtSecret),
		}
	}
	console.log(`User authorised with address ${address}`)
	return {
		id: userOpt.id!,
		jwt: jwt.sign(userPayload(userOpt), jwtSecret),
	}
}

function userPayload(user: UserEntity): UserPayload {
	return {
		id: user.id!,
		address: user.address,
	}
}

export async function userDetails(userId: number): Promise<UserDetails> {
	const user = await findById(userId)
	if (!user) {
		throw new BadRequestError('User not found')
	}
	return {
		id: user.id!,
		address: user.address,
		balance: await balance(user.address),
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
    address: string,
    balance: number,
    producer: boolean,
    createdAt: Date,
}

export interface SigninRequest {
	username: string
	password: string
}

interface UserPayload {
	id: number,
	address: string,
}
