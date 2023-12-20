import Application from 'koa'
import {decodeJwt} from '../../service/user/hash'
import {userDetails} from '../../service/user/user'

export async function me(ctx: Application.ParameterizedContext){
	const userInfo = decodeJwt(ctx.request)
	ctx.body = await userDetails(userInfo.id)
}
