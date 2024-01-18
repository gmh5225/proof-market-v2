import {Body, Controller, Get, Header, Path, Post, Route} from "tsoa";
import {findById, insert, RequestEntity, RequestStatus} from "../repository/request";
import {BadRequestError} from "../handler/error/error";
import {dbClient} from "../db/client";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";
import {CreateRequestRequest} from "../handler/request/request";
import {decodeAuthToken, decodeJwt} from "../service/user/hash";

@Route("/request")
export class RequestController extends Controller {

    @Get("/:id")
    public async getById(
        @Path("id") id: number,
    ): Promise<RequestItem> {
        const entity = await findById(id)
        if (!entity) {
            throw new BadRequestError('Request not found')
        }
        return {
            id: entity.id!,
            status: RequestStatus[entity.status],
            statement_key: entity.statementId,
            cost: entity.cost,
            proof_key: entity.proofId,
            input: entity.input,
            aggregatedModeId: entity.aggregatedModeId,
        }
    }

    @Get()
    public async getByFilter(
        @Query("costFrom") costFrom: number | undefined,
        @Query("createdAtFrom") createdAtFrom: Date | undefined,
    ): Promise<RequestItem[]> {
        let queryBuilder = dbClient<RequestEntity>('request')
            .where('status', RequestStatus[RequestStatus.NEW])
            .where('assignedId', null);
        if (costFrom) {
            queryBuilder = queryBuilder.where('cost', '>=', costFrom!)
        }
        if (createdAtFrom) {
            queryBuilder = queryBuilder.where('createdAt', '>=', createdAtFrom)
        }
        return (await queryBuilder)
            .map(r => {
                return {
                    id: r.id!,
                    status: RequestStatus[r.status],
                    statement_key: r.statementId,
                    cost: r.cost,
                    proof_key: r.proofId,
                    input: r.input,
                    aggregated_mode_id: r.aggregatedModeId,
                }
            })
    }

    @Post()
    public async createRequest(
        @Body() request: CreateRequestRequest,
        @Header("authorization") jwt: string | undefined
    ): Promise<RequestItem> {
        const userInfo = decodeAuthToken(jwt)
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
        return  {
            id: saved.id!,
            status: RequestStatus[saved.status],
            statement_key: request.statement_key,
            cost: request.cost,
            proof_key: null,
            aggregatedModeId: request.aggregated_mode_id || null,
            input: saved.input,
        }
    }
}

export interface RequestItem {
    id: number,
    status: string,
    statement_key: number,
    cost: number,
    proof_key: number | null,
    input: any,
    aggregated_mode_id: number | null,
}
