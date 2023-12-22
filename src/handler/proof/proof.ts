import Application from 'koa'
import {decodeJwt} from '../../service/user/hash'
import {findById as findRequestById, RequestStatus, update as updateRequest} from '../../repository/request'
import {BadRequestError} from '../error/error'
import {insert as insertProof, findById as findProofById, ProofEntity} from '../../repository/proof'

export async function submitProof(ctx: Application.ParameterizedContext) {
	const userInfo = decodeJwt(ctx.request)
	const r = ctx.request.body as SubmitProofRequest
	console.log(`submitProof - ${JSON.stringify(r)}`)
	const request = await findRequestById(r.request_key)
	if (!request) {
		throw new BadRequestError('Request not found')
	}
	const proof: ProofEntity = {
		id: undefined,
		createdAt: new Date(),
		updatedAt: new Date(),
		proof: r.proof,
		requestId: r.request_key,
		producerId: userInfo.id,
		generationTime: new Date().getTime() - request.createdAt.getTime(),
	}
	const saved = await insertProof(proof);
	console.log(`save proof - ${JSON.stringify(saved)}`)
	request.status = RequestStatus.DONE
	request.updatedAt = new Date()
	request.proofId = saved.id!
	request.input = JSON.stringify(request.input)
	console.log(`save request - ${JSON.stringify(request)}`)
	await updateRequest(request)
	ctx.body = {}
}

export async function getProof(ctx: Application.ParameterizedContext) {
	const id = ctx.params.id
	const proof = await findProofById(id)
	if (!proof) {
		throw new BadRequestError('Proof not found')
	}
	ctx.body = {
		id: proof.id!.toString(),
		proof: proof.proof
	}
}

export interface SubmitProofRequest {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    proof: any,
    request_key: number,
    proposal_key: number,
}