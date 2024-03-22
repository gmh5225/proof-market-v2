import {Body, Controller, Delete, Get, Header, Path, Post, Route} from 'tsoa'
import {decodeAuthToken} from '../service/user/hash'
import {Query} from '@tsoa/runtime/dist/decorators/parameter'
import {insert, ProposalEntity, ProposalStatus} from '../repository/proposal'
import {dbClient} from '../db/client'
import {BadRequestError} from '../handler/error/error'

@Route('/proposal')
export class ProposalController extends Controller {

	// DONE
	@Get('/:id')
	public async getById(
		@Path('id') id: number,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Header('authorization') jwt: string | undefined,
	): Promise<ProposalItem> {
		const proposal = await dbClient<ProposalEntity>('proposal')
			.where('id', id)
			.first()
			.select()
		if (!proposal) {
			throw new BadRequestError('No proposal')
		}
		return {
			id: proposal.id!,
			statementId: proposal.statement_id,
			status: proposal.status,
			cost: proposal.cost,
		}
	}

	// DONE
	@Get()
	public async getByFilter(
		@Query('limit') limit: number = 10,
		@Query('offset') offset: number = 0,
		@Query('owned') owned: boolean = false,
		@Query('statementId') statementId: number | undefined,
		@Query('status') status: ProposalStatus | undefined,
		@Header('authorization') jwt: string | undefined,
	): Promise<ProposalItem[]> {
		let builder = dbClient<ProposalEntity>('proposal')
		if (status) {
			builder = builder.where('status', ProposalStatus[status])
		}
		if (owned) {
			const userInfo = decodeAuthToken(jwt)
			builder = builder.where('sender_id', userInfo.id)
		}
		if (statementId) {
			builder = builder.where('statement_id', statementId)
		}
		const proposals = await builder
			.limit(limit)
			.offset(offset)
			.orderBy('created_at', 'desc')
		return proposals.map(r => {
			return {
				statementId: r.statement_id,
				status: r.status,
				id: r.id!,
				cost: r.cost,
			}
		})
	}

	// DONE
	@Post()
	public async createProposal(
		@Body() request: CreateProposalRequest,
		@Header('authorization') jwt: string | undefined,
	): Promise<ProposalItem> {
		const userInfo = decodeAuthToken(jwt)
		console.log(`User ${userInfo.id}: create proposal - ${JSON.stringify(request)}`)
		const proposal = {
			id: undefined,
			created_at: new Date(),
			updated_at: new Date(),
			statement_id: request.statementId,
			cost: request.cost,
			sender_id: userInfo.id,
			waiting_duration_seconds: request.waitingDurationSeconds,
			max_generation_duration_seconds: request.maxGenerationDurationSeconds,
			status: ProposalStatus.NEW,
			matched_time: null,
			request_id: null,
			proof_id: null,
			generation_time: null,
		} as ProposalEntity
		const saved = await insert(proposal)
		return {
			statementId: saved.statement_id,
			id: saved.id!,
			cost: saved.cost,
			status: saved.status,
		}
	}

	// DONE
	@Delete('/:id')
	public async deleteProposal(
		@Path('id') id: number,
		@Header('authorization') jwt: string | undefined,
	): Promise<void> {
		const userInfo = decodeAuthToken(jwt)
		const result = await dbClient<ProposalEntity>('proposal')
			.delete()
			.where('id', id)
			.where('sender_id', userInfo.id)
			.where('status', ProposalStatus[ProposalStatus.NEW])
		if (result < 1) {
			throw new BadRequestError('Proposal not found')
		}
	}
}

export interface ProposalItem {
	statementId: number,
	id: number,
	cost: number,
	status: ProposalStatus,
}

export interface CreateProposalRequest {
	statementId: number,
	cost: number,
	waitingDurationSeconds: number,
	maxGenerationDurationSeconds: number,
}
