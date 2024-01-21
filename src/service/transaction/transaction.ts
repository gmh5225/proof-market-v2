import {BadRequestError} from '../../handler/error/error'
import {existsById} from '../../repository/user'
import {changeBalance, userBalanceInfo} from '../user/balance'
import {insert, TransactionEntity} from '../../repository/transaction'
import {PayRequest} from "../../route/UserController";

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
		id: undefined,
		sender_id: request.sender,
		receiver_id: request.receiver,
		amount: request.amount,
		created_at: new Date(),
		updated_at: new Date(),
	}
	const tx = await insert(newTx)
	await changeBalance(-request.amount, request.sender)
	await changeBalance(request.amount, request.receiver)
	return {
		id: tx.id!,
		sender: tx.sender_id,
		receiver: tx.receiver_id,
		amount: tx.amount,
	}
}

export interface TransactionInfo {
    id: number,
    sender: number,
    receiver: number,
    amount: number,
}
