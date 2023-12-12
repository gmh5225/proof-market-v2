import Application from "koa";
import {existsByLogin} from "../../service/user/user";

export async function exists(ctx: Application.ParameterizedContext){
    const userInfo = await existsByLogin(ctx.params.login);
    if (userInfo) {
        ctx.status = 200
    } else {
        ctx.status = 404
    }
}
