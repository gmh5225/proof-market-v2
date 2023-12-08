import Application from "koa";
import {createUser, login} from "./user";

export async function singin(ctx: Application.ParameterizedContext) {
    const request: SigninRequest = ctx.request.body as SigninRequest;
    const jwt = await login(request);
    ctx.body = {
        jwt: jwt,
    }

}

export interface SigninRequest {
    login: string
    password: string
}
