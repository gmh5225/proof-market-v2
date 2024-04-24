import {Body, Controller, Get, Header, Post, Route} from 'tsoa'
import {Query} from '@tsoa/runtime/dist/decorators/parameter'
import {findById as findProofById, insert as insertProof, ProofEntity} from '../repository/proof'
import {BadRequestError} from '../handler/error/error'
import {decodeAuthToken} from '../service/user/hash'
import {findById as findRequestById, RequestStatus, update as updateRequest} from '../repository/request'
import logger from '../logger'
import {assign} from "../service/proof/assigner";
import {verify} from "../service/proof/verifier";

@Route('/proof')
export class ProofController extends Controller {

	@Get('/:id')
	public async getById(
		@Query('id') id: number,
	): Promise<ProofItem> {
		const proof = await findProofById(id)
		if (!proof) {
			throw new BadRequestError('Proof not found')
		}
		return {
			id: proof.id!,
			proof: proof.proof,
		}
	}

	@Post()
	public async submitProof(
		@Body() request: SubmitProofRequest,
		@Header('authorization') jwt: string | undefined,
	): Promise<ProofItem> {
		const userInfo = decodeAuthToken(jwt)
		const requestEntity = await findRequestById(request.requestId)
		if (!requestEntity) {
			throw new BadRequestError('Request not found')
		}
		const proof: ProofEntity = {
			id: undefined,
			created_at: new Date(),
			updated_at: new Date(),
			proof: request.proof,
			request_id: request.requestId,
			producer_id: userInfo.id,
			generation_time: new Date().getTime() - requestEntity.created_at.getTime(),
		}
		const assignResult = await assign(requestEntity.id!, requestEntity.statement_id)
		const result = await verify(assignResult, proof.proof)
		if (!result) {
			throw new BadRequestError('Proof is not valid')
		}
		const saved = await insertProof(proof)
		logger.info(`save proof - ${saved.id}`)
		requestEntity.status = RequestStatus.DONE
		requestEntity.updated_at = new Date()
		requestEntity.proof_id = saved.id!
		requestEntity.input = JSON.stringify(requestEntity.input)
		logger.info(`save request - ${JSON.stringify(request)}`)
		await updateRequest(requestEntity)
		return {
			id: saved.id!,
			proof: saved.proof,
		}
	}
}

export interface ProofItem {
	id: number,
	proof: string,
}

export interface SubmitProofRequest {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	proof: string,
	requestId: number,
	proposalId: number,
}

export interface ProofOwnedItem {
	id: number,
	proof: string,
	requestId: number,
	producerId: number,
	generationTime: number,
	input: string,
	statementId: number,
	statementName: string,
	description: string,
	statementDescription: string,
}
