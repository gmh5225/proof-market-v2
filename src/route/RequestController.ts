import {Body, Controller, Delete, Get, Header, Path, Post, Route} from "tsoa";
import {findById, insert, RequestEntity, RequestStatus} from "../repository/request";
import {BadRequestError} from "../handler/error/error";
import {dbClient} from "../db/client";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";
import {decodeAuthToken} from "../service/user/hash";

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
            statement_key: entity.statement_id,
            cost: entity.cost,
            proof_key: entity.proof_id,
            input: entity.input,
            aggregated_mode_id: entity.aggregated_mode_id,
        }
    }

    @Get()
    public async getByFilter(
        @Query("costFrom") costFrom: number | undefined,
        @Query("createdAtFrom") createdAtFrom: Date | undefined,
        @Query("limit") limit: number = 10,
        @Query("offset") offset: number = 0,
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
        return (await queryBuilder.limit(limit).offset(offset))
            .map(r => {
                return {
                    id: r.id!,
                    status: RequestStatus[r.status],
                    statement_key: r.statement_id,
                    cost: r.cost,
                    proof_key: r.proof_id,
                    input: r.input,
                    aggregated_mode_id: r.aggregated_mode_id,
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
            created_at: new Date(),
            updated_at: new Date(),
            statement_id: request.statement_key,
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
        return  {
            id: saved.id!,
            status: RequestStatus[saved.status],
            statement_key: request.statement_key,
            cost: request.cost,
            proof_key: null,
            aggregated_mode_id: request.aggregatedModeId || null,
            input: saved.input,
        }
    }

    @Delete('/:id')
    public async deleteRequest(
        @Path("id") id: number,
        @Header("authorization") jwt: string | undefined
    ): Promise<void> {
        const userInfo = decodeAuthToken(jwt)
        const result = await dbClient<RequestEntity>('request')
            .delete()
            .where('id', id)
            .where('sender_id', userInfo.id)
        if (result < 0) {
            throw new BadRequestError('Request not found')
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

export interface CreateRequestRequest {
    statement_key: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    cost: number,
    aggregatedModeId: number | undefined,
}
