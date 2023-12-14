import Application from 'koa'
import {createUser, login} from '../../service/user/user'

export async function signup(ctx: Application.ParameterizedContext) {
	console.log(ctx.request.body)
	const request: SignupRequest = ctx.request.body as SignupRequest
	const user = await createUser(request)
	ctx.body = await login({
		login: user.login,
		password: request.passwd,
	})
}

export interface SignupRequest {
    login: string
    passwd: string
    email?: string
}
