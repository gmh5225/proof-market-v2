import Application from "koa";
import {userBalanceInfo} from "../../service/user/balance";
import {decodeJwt} from "../../service/user/hash";

export async function balance(ctx: Application.ParameterizedContext){
    const userInfo = decodeJwt(ctx.request);
    ctx.body = await userBalanceInfo(userInfo.id)
}
