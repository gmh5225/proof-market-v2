import {PayRequest} from '../../handler/user/pay'
import {BadRequestError} from '../../handler/error/error'
import {existsById} from '../../repository/user'
import {changeBalance, userBalanceInfo} from '../user/balance'
import {insert, TransactionEntity} from '../../repository/transaction'

export async function createPayTransaction(request: PayRequest, userId: number): Promise<TransactionInfo> {
	if (request.sender !== userId) {
		throw new BadRequestError('Invalid sender')
	}
	const senderBalance = await userBalanceInfo(userId)
	if (senderBalance && senderBalance.balance - senderBalance.blocked < request.amount) {
		throw new BadRequestError('Not enough money')
	}
	const receiverExists = existsById(request.receiver)
	if (!receiverExists) {
		throw new BadRequestError('Receiver account does not exist')
	}
	const newTx: TransactionEntity = {
		id: null,
		senderId: request.sender,
		receiverId: request.receiver,
		amount: request.amount,
		createdAt: new Date(),
		updatedAt: new Date(),
	}
	const tx = await insert(newTx)
	await changeBalance(-request.amount, request.sender)
	await changeBalance(request.amount, request.receiver)
	return {
		id: tx.id!,
		sender: tx.senderId,
		receiver: tx.receiverId,
		amount: tx.amount,
	}
}

export interface TransactionInfo {
    id: number,
    sender: number,
    receiver: number,
    amount: number,
}
