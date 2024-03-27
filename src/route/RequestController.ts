import {Body, Controller, Delete, Get, Header, Path, Post, Route} from 'tsoa'
import {findById, insert, RequestEntity, RequestStatus} from '../repository/request'
import {BadRequestError} from '../handler/error/error'
import {dbClient} from '../db/client'
import {Query} from '@tsoa/runtime/dist/decorators/parameter'
import {decodeAuthToken} from '../service/user/hash'

@Route('/request')
export class RequestController extends Controller {

	// DONE
	@Get('/:id')
	public async getById(
		@Path('id') id: number,
	): Promise<RequestItem> {
		const entity = await findById(id)
		if (!entity) {
			throw new BadRequestError('Request not found')
		}
		return {
			id: entity.id!,
			status: entity.status,
			statementId: entity.statement_id,
			cost: entity.cost,
			proofId: entity.proof_id,
			input: entity.input,
			aggregatedModeId: entity.aggregated_mode_id,
		}
	}

	// DONE
	@Get()
	public async getByFilter(
		@Query('costFrom') costFrom: number | undefined,
		@Query('createdAtFrom') createdAtFrom: Date | undefined,
		@Query('owned') owned: boolean = false,
		@Query('statementId') statementId: number | undefined,
		@Query('status') status: RequestStatus | undefined,
		@Query('limit') limit: number = 10,
		@Query('offset') offset: number = 0,
		@Header('authorization') jwt: string | undefined,
	): Promise<RequestItem[]> {
		let queryBuilder = dbClient<RequestEntity>('request')
		if (costFrom) {
			queryBuilder = queryBuilder.where('cost', '>=', costFrom!)
		}
		if (createdAtFrom) {
			queryBuilder = queryBuilder.where('createdAt', '>=', createdAtFrom)
		}
		if (owned) {
			const userInfo = decodeAuthToken(jwt)
			queryBuilder = queryBuilder.where('sender_id', userInfo.id)
		}
		if (statementId) {
			queryBuilder = queryBuilder.where('statement_id', statementId)
		}
		if (status) {
			queryBuilder = queryBuilder.where('status', RequestStatus[status])
		}
		return (await queryBuilder.limit(limit).offset(offset))
			.map(r => {
				return {
					id: r.id!,
					status: r.status,
					statementId: r.statement_id,
					cost: r.cost,
					proofId: r.proof_id,
					input: r.input,
					aggregatedModeId: r.aggregated_mode_id,
				}
			})
	}

	// DONE
	@Post()
	public async createRequest(
		@Body() request: CreateRequestRequest,
		@Header('authorization') jwt: string | undefined,
	): Promise<RequestItem> {
		const userInfo = decodeAuthToken(jwt)
		const entity: RequestEntity = {
			id: undefined,
			created_at: new Date(),
			updated_at: new Date(),
			statement_id: request.statementId,
			cost: request.cost,
			eval_time: null,
			wait_period: null,
			input: JSON.stringify(request.input),
			sender_id: userInfo.id,
			status: RequestStatus.NEW,
			proof_id: null,
			assigned_id: null,
			aggregated_mode_id: request.aggregatedModeId || null,
		}
		const saved = await insert(entity)
		return {
			id: saved.id!,
			status: saved.status,
			statementId: request.statementId,
			cost: request.cost,
			proofId: null,
			aggregatedModeId: request.aggregatedModeId || null,
			input: saved.input,
		}
	}

	// DONE
	@Delete('/:id')
	public async deleteRequest(
		@Path('id') id: number,
		@Header('authorization') jwt: string | undefined,
	): Promise<void> {
		const userInfo = decodeAuthToken(jwt)
		const result = await dbClient<RequestEntity>('request')
			.delete()
			.where('id', id)
			.where('sender_id', userInfo.id)
			.where('status', RequestStatus[RequestStatus.NEW])
		if (result < 0) {
			throw new BadRequestError('Request not found')
		}
	}
}

export interface RequestItem {
	id: number,
	status: RequestStatus,
	statementId: number,
	cost: number,
	proofId: number | null,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	input: any,
	aggregatedModeId: number | null,
}

export interface CreateRequestRequest {
	statementId: number,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	input: any,
	cost: number,
	aggregatedModeId: number | undefined,
}
