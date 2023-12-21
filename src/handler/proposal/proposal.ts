import Application from 'koa'
import {dbClient} from "../../db/client";
import {decodeJwt} from "../../service/user/hash";
import {RequestEntity, RequestStatus} from "../../repository/request";

export async function getProposals(ctx: Application.ParameterizedContext) {
    const userInfo = decodeJwt(ctx.request)
    const status = ctx.query.status;
    console.log(`Proposals ${status} ${userInfo.id}`)
    if (status == 'processing') {
        const requests = await dbClient<RequestEntity>('request')
            .where('status', RequestStatus.PENDING)
            .where('assignedId', userInfo.id)
        console.log(`Proposals ${requests}`)
        ctx.body = requests.map(r => {
            return {
                statement_key: r.statementId.toString(),
            }
        })
        return
    }
    ctx.body = []
}

export async function createProposals(ctx: Application.ParameterizedContext) {
    ctx.body = {}
}