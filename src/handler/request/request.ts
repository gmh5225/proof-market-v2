import Application from 'koa'
import {findById, insert, RequestEntity, RequestStatus} from '../../repository/request'
import {decodeJwt} from '../../service/user/hash'
import {BadRequestError} from '../error/error'
import {dbClient} from "../../db/client";

export async function getRequestsFilterHandler(ctx: Application.ParameterizedContext) {
	let queryBuilder = dbClient<RequestEntity>('request')
		.where('status', RequestStatus[RequestStatus.NEW])
		.where('assignedId', null);
	if (ctx.query.costFrom) {
		queryBuilder = queryBuilder.where('cost', '>=', ctx.query.costFrom!)
	}
	if (ctx.query.createdAtFrom) {
		queryBuilder = queryBuilder.where('createdAt', '>=', ctx.query.createdAtFrom)
	}
	ctx.body = (await queryBuilder)
		.map(r => {
			return {
				_key: r.id,
				status: RequestStatus[r.status],
				statement_key: r.statementId,
				cost: r.cost,
				proof_key: r.proofId?.toString(),
				input: r.input,
				aggregated_mode_id: r.aggregatedModeId,
			}
		})
}

export async function getRequestHandler(ctx: Application.ParameterizedContext) {
	const id = ctx.params.id
	const entity = await findById(id)
	if (!entity) {
		throw new BadRequestError('Request not found')
	}
	ctx.body = {
		_key: entity.id,
		status: RequestStatus[entity.status],
		statement_key: entity.statementId,
		cost: entity.cost,
		proof_key: entity.proofId?.toString(),
		input: entity.input,
		aggregated_mode_id: entity.aggregatedModeId,
	}
}

export async function createRequestHandler(ctx: Application.ParameterizedContext) {
	const userInfo = decodeJwt(ctx.request)
	const request = ctx.request.body as CreateRequestRequest
	const entity: RequestEntity = {
		id: undefined,
		createdAt: new Date(),
		updatedAt: new Date(),
		statementId: request.statement_key,
		cost: request.cost,
		evalTime: null,
		waitPeriod: null,
		input: JSON.stringify(request.input),
		senderId: userInfo.id,
		status: RequestStatus.NEW,
		proofId: null,
		assignedId: null,
		aggregatedModeId: request.aggregated_mode_id || null,
	}
	const saved = await insert(entity)
	ctx.body = {
		_key: saved.id,
		status: RequestStatus[saved.status],
		statement_key: request.statement_key,
		cost: request.cost,
		proof_key: null,
		aggregated_mode_id: request.aggregated_mode_id,
	}
}

export interface CreateRequestRequest {
    statement_key: number,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    cost: number,
	aggregated_mode_id: number | undefined,
}
