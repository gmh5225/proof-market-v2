import Application from 'koa'
import {decodeJwt} from '../../service/user/hash'
import {registerOrUpdate} from '../../service/producer/producer'

export async function registerHandler(ctx: Application.ParameterizedContext){
	const userInfo = decodeJwt(ctx.request)
	const request = ctx.request.body as RegisterProducerRequest
	const producerEntity = await registerOrUpdate(request, userInfo.id)
	ctx.body = {
		name : producerEntity.name,
		description: producerEntity.description,
		url: producerEntity.url,
		ethAddress: producerEntity.ethAddress,
	}
}

export interface RegisterProducerRequest {
    name: string,
    description: string,
    url: string,
    ethAddress: number,
}
