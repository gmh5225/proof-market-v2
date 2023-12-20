import Application from 'koa'
import {createPayTransaction} from '../../service/transaction/transaction'
import {decodeJwt} from '../../service/user/hash'

export async function pay(ctx: Application.ParameterizedContext) {
	const request: PayRequest = ctx.request.body as PayRequest
	const userInfo = decodeJwt(ctx.request)
	ctx.body = await createPayTransaction(request, userInfo.id)
}

export interface PayRequest {
    sender: number,
    receiver: number,
    amount: number,
}