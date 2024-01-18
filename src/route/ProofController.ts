import {Body, Controller, Get, Header, Post, Route} from "tsoa";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";
import {findById as findProofById, insert as insertProof, ProofEntity} from "../repository/proof";
import {BadRequestError} from "../handler/error/error";
import {SubmitProofRequest} from "../handler/proof/proof";
import {decodeAuthToken} from "../service/user/hash";
import {findById as findRequestById, RequestStatus, update as updateRequest} from "../repository/request";

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
        return  {
            id: proof.id!,
            proof: proof.proof
        }
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
            createdAt: new Date(),
            updatedAt: new Date(),
            proof: request.proof,
            requestId: request.request_key,
            producerId: userInfo.id,
            generationTime: new Date().getTime() - requestEntity.createdAt.getTime(),
        }
        const saved = await insertProof(proof);
        console.log(`save proof - ${saved.id}`)
        requestEntity.status = RequestStatus.DONE
        requestEntity.updatedAt = new Date()
        requestEntity.proofId = saved.id!
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