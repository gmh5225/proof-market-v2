import Application from 'koa'
import {decodeJwt} from "../../service/user/hash";
import {RequestStatus} from "../../repository/request";
import {createProposal, getProposals} from "../../service/proposal/proposal";

export async function getProposalsHandler(ctx: Application.ParameterizedContext) {
    const userInfo = decodeJwt(ctx.request)
    const status = ctx.query.status;
    const filter = {
        status: status
    } as ProposalFilter
    console.log(`Proposals ${status} ${userInfo.id}`)
    ctx.body = await getProposals(userInfo.id, filter);
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