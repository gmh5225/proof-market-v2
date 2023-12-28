import Application from 'koa'
import {RequestEntity, RequestStatus, insert, findById} from '../../repository/request'
import {decodeJwt} from '../../service/user/hash'
import {BadRequestError} from '../error/error'

export async function getRequestsFilter(ctx: Application.ParameterizedContext) {
	// TODO: after mvp
	ctx.status = 404
}

export async function getRequest(ctx: Application.ParameterizedContext) {
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
	}
}

export async function createRequest(ctx: Application.ParameterizedContext) {
	const userInfo = decodeJwt(ctx.request)
	const request = ctx.request.body as CreateRequestRequest
	const entity: RequestEntity = {
		id: undefined,
		createdAt: new Date(),
		updatedAt: new Date(),
		statementId: parseInt(request.statement_key),
		cost: request.cost,
		evalTime: null,
		waitPeriod: null,
		input: JSON.stringify(request.input),
		senderId: userInfo.id,
		status: RequestStatus.NEW,
		proofId: null,
		assignedId: null,
	}
	const saved = await insert(entity) // TODO: save aggregated_mode_id
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
    statement_key: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    cost: number,
	aggregated_mode_id: number | undefined, // TODO: save to db
}