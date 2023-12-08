import Application from "koa";
import {createUser} from "./user";

export async function signup(ctx: Application.ParameterizedContext) {
    const request: SignupRequest = ctx.request.body as SignupRequest;
    const user = await createUser(request);
    // TODO: think about changing response to auth token
    ctx.body = {
        login: user.login,
        passwrd: user.password,
        email: request.email,
    }

}

export interface SignupRequest {
    login: string
    passwd: string
    email?: string
}
