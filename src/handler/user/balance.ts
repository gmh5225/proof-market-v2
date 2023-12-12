import Application from "koa";
import {userBalance} from "../../service/user/balance";
import {userBlockedTokensAmount} from "../../service/request/request";
import {decodeJwt} from "../../service/user/hash";

export async function balance(ctx: Application.ParameterizedContext){
    const userInfo = decodeJwt(ctx.request);
    const balance = await userBalance(userInfo.id);
    const blocked = await userBlockedTokensAmount(userInfo.id)
    ctx.body = {
        user: userInfo.login,
        balance: balance,
        blocked: blocked,
    }
}
