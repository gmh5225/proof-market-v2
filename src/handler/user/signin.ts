import Application from 'koa'
import {login} from '../../service/user/user'

export async function singin(ctx: Application.ParameterizedContext) {
	const request: SigninRequest = ctx.request.body as SigninRequest
	ctx.body = await login(request)
}

export interface SigninRequest {
    login: string
    password: string
}
