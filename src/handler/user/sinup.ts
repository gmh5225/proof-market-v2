import Application from 'koa'
import {createUser, login} from '../../service/user/user'

export async function signup(ctx: Application.ParameterizedContext) {
	const request: SignupRequest = ctx.request.body as SignupRequest
	const user = await createUser(request)
	const jwt = await login({
		login: request.login,
		password: request.passwd,
	})
	ctx.body = {
		jwt: jwt,
	}
}

export interface SignupRequest {
    login: string
    passwd: string
    email?: string
}
