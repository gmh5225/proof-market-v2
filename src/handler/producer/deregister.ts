import Application from 'koa'
import {decodeJwt} from '../../service/user/hash'
import {removeProducer} from '../../service/producer/producer'

export async function deregister(ctx: Application.ParameterizedContext){
	const userInfo = decodeJwt(ctx.request)
	const removed: boolean = await removeProducer(userInfo.id)
	ctx.body = {
		removed,
	}
}
