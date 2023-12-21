import Application from 'koa'
import {decodeJwt} from '../../service/user/hash'
import {findById as findRequestById, RequestStatus, update as updateRequest} from '../../repository/request'
import {BadRequestError} from '../error/error'
import {insert as insertProof, findById as findProofById, ProofEntity} from '../../repository/proof'

export async function submitProof(ctx: Application.ParameterizedContext) {
	const userInfo = decodeJwt(ctx.request)
	const r = ctx.request.body as SubmitProofRequest
	const request = await findRequestById(r.request_key)
	if (!request) {
		throw new BadRequestError('Request not found')
	}
	const proof: ProofEntity = {
		id: undefined,
		createdAt: new Date(),
		updatedAt: new Date(),
		proof: r.proof,
		proposalId: null,
		requestId: r.request_key,
		producerId: userInfo.id,
		generationTime: new Date().getTime() - request.createdAt.getTime(),
	}
	await insertProof(proof)
	request.status = RequestStatus.DONE
	request.updatedAt = new Date()
	await updateRequest(request)

}

export async function getProof(ctx: Application.ParameterizedContext) {
	const id = ctx.params.id
	const proof = await findProofById(id)
	if (!proof) {
		throw new BadRequestError('Proof not found')
	}
	ctx.body = proof.proof
}

export interface SubmitProofRequest {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    proof: any,
    request_key: number,
    proposal_key: number,
}