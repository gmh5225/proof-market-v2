import Application from "koa";
import {decodeJwt} from "../../service/user/user";
import {userBalance} from "../../service/user/balance";
import {userBlockedTokensAmount} from "../../service/request/request";

export async function balance(ctx: Application.ParameterizedContext){
    const userInfo = decodeJwt(ctx.request);
    const balance = userBalance(userInfo.id);
    const blocked = userBlockedTokensAmount(userInfo.id)
    ctx.body = {
        user: userInfo.login,
        balance: balance,
        blocked: blocked,
    }
}
