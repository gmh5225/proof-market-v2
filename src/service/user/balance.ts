import {BadRequestError} from '../../handler/error/error'
import {findById, update} from '../../repository/user'
import {userBlockedTokensAmount} from '../request/request'
import {getBalance, transfer} from "../blockchain/client";

export async function userBalanceInfo(userId: number): Promise<UserBalanceInfo> {
	const user = await findById(userId)
	if (!user) {
		throw new BadRequestError('User not found')
	}
	const blocked = await userBlockedTokensAmount(userId)
	const balance = await getBalance(user.address)
	return {
		user: userId,
		balance: balance,
		blocked: blocked ?? 0,
	}
}

export async function changeBalance(value: number, userId: number) {
	const user = await findById(userId)
	if (!user) {
		throw new BadRequestError('User not found')
	}
	// TODO: finish transfer
}

export interface UserBalanceInfo {
    user: number,
    balance: number,
    blocked: number,
}
