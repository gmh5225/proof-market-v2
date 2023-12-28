import Application from 'koa'
import {dbClient} from "../../db/client";
import {decodeJwt} from "../../service/user/hash";
import {RequestEntity, RequestStatus} from "../../repository/request";
import {createProposal} from "../../service/proposal/proposal";

export async function getProposalsHandler(ctx: Application.ParameterizedContext) {
    const userInfo = decodeJwt(ctx.request)
    const status = ctx.query.status;
    const filter = {
        status: status
    } as ProposalFilter
    console.log(`Proposals ${status} ${userInfo.id}`)
    if (status == 'processing') {
        const requests = await dbClient<RequestEntity>('request')
            .where('status', RequestStatus.PENDING)
            .where('assignedId', userInfo.id)
        console.log(`Proposals ${requests}`)
        ctx.body = requests.map(r => {
            return {
                statement_key: r.statementId.toString(),
                request_key: r.id!.toString(),
                _key: r.id!.toString(),
            }
        })
        return
    }
    ctx.body = []
}

export async function createProposalsHandler(ctx: Application.ParameterizedContext) {
    const userInfo = decodeJwt(ctx.request)
    const request = ctx.request.body as CreateProposalRequest
    console.log(`Create proposal - ${request} by ${userInfo.id}`)
    ctx.body = await createProposal(userInfo.id, request)
}

export interface ProposalFilter {
    status: RequestStatus | undefined,
}

export interface ProposalItem {
    statement_key: string,
    request_key: string,
    _key: string,
}

export interface CreateProposalRequest {
    request_id: string,
    cost: number,
    aggregated_mode_id: number | undefined,
    wait_period_in_seconds: number,
}