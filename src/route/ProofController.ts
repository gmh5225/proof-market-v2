import {Body, Controller, Get, Header, Post, Route} from "tsoa";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";
import {findById as findProofById, insert as insertProof, ProofEntity} from "../repository/proof";
import {BadRequestError} from "../handler/error/error";
import {decodeAuthToken} from "../service/user/hash";
import {findById as findRequestById, RequestStatus, update as updateRequest} from "../repository/request";
import {dbClient} from "../db/client";

@Route("/proof")
export class ProofController extends Controller {

    @Get(":id")
    public async getById(
        @Query("id") id: number,
    ): Promise<ProofItem> {
        const proof = await findProofById(id)
        if (!proof) {
            throw new BadRequestError('Proof not found')
        }
        return {
            id: proof.id!,
            proof: proof.proof
        }
    }

    @Get('/owned')
    public async getOwnedProofs(
        @Query("limit") limit: number = 10,
        @Query("offset") offset: number = 0,
        @Header("authorization") jwt: string | undefined,
    ): Promise<ProofOwnedItem[]> {
        const userInfo = decodeAuthToken(jwt)
        const result = await dbClient('request as r')
            .select(
                'p.id AS id',
                'p.proof AS proof',
                'p.request_id AS request_id',
                'p.producer_id AS producer_id',
                'p.generation_time AS generation_time',
                'r.input AS input',
                's._key AS statement_key',
                's.name AS name',
                's.description as description'
            )
            .leftJoin('proof as p', 'r.proof_key', 's.id')
            .leftJoin('statement as s', 'r.statement_key', 's._key')
            .where('r.sender', userInfo.id)
            .where('r.status', 'completed')
            .orderBy('r.updatedOn', 'desc')
            .limit(limit)
            .offset(offset);
        return result.map(e => {
            return {
                id: e.id,
                proof: e.proof,
                requestId: e.request_id,
                producerId: e.producer_id,
                generationTime: e.generation_time,
                input: e.input,
                statementId: e.statement_id,
                statementName: e.name,
                description: e.description,
                statementDescription: e.description,
            }
        })
    }

    @Post()
    public async submitProof(
        @Body() request: SubmitProofRequest,
        @Header("authorization") jwt: string | undefined,
    ): Promise<ProofItem> {
        const userInfo = decodeAuthToken(jwt)
        const requestEntity = await findRequestById(request.request_key)
        if (!requestEntity) {
            throw new BadRequestError('Request not found')
        }
        const proof: ProofEntity = {
            id: undefined,
            created_at: new Date(),
            updated_at: new Date(),
            proof: request.proof,
            request_id: request.request_key,
            producer_id: userInfo.id,
            generation_time: new Date().getTime() - requestEntity.created_at.getTime(),
        }
        const saved = await insertProof(proof);
        console.log(`save proof - ${saved.id}`)
        requestEntity.status = RequestStatus.DONE
        requestEntity.updated_at = new Date()
        requestEntity.proof_id = saved.id!
        requestEntity.input = JSON.stringify(requestEntity.input)
        console.log(`save request - ${JSON.stringify(request)}`)
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
    proof: any,
    request_key: number,
    proposal_key: number,
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