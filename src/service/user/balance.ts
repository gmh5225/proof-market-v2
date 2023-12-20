import {BadRequestError} from '../../handler/error/error'
import {findById, update} from '../../repository/user'
import {userBlockedTokensAmount} from '../request/request'

export async function userBalanceInfo(userId: number): Promise<UserBalanceInfo> {
	const user = await findById(userId)
	if (!user) {
		throw new BadRequestError('User not found')
	}
	const blocked = await userBlockedTokensAmount(userId)
	return {
		user: userId,
		balance: Number(user.balance),
		blocked: blocked ?? 0,
	}
}

export async function changeBalance(value: number, userId: number) {
	const user = await findById(userId)
	if (!user) {
		throw new BadRequestError('User not found')
	}
	user.balance += BigInt(value)
	await update(user)
}

export interface UserBalanceInfo {
    user: number,
    balance: number,
    blocked: number,
}
