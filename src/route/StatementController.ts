import {Body, Controller, Get, Header, Path, Post, Route} from "tsoa";
import {dbClient} from "../db/client";
import {insert, StatementEntity} from "../repository/statement";
import {NotFoundError} from "../handler/error/error";
import {decodeAuthToken} from "../service/user/hash";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";
import {statementBookInfo} from "../service/book/book";

@Route("/statement")
export class StatementController extends Controller {

    @Get('/:id')
    public async getById(
        @Path("id") id: string,
        @Header("authorization") jwt: string | undefined
    ): Promise<StatementItem> {
        const statement = await dbClient<StatementEntity>('statement')
            .where('id', id)
            .first()
        if (!statement) {
            throw new NotFoundError("Statement not found")
        }
        return {
            id: statement.id!,
            name: statement.name,
            description: statement.description,
            url: statement.url,
            input_description: statement.input_description,
            type: statement.type,
            isPrivate: statement.private,
            definition: statement.definition,
        }
    }

    @Get()
    public async getByFilter(
        @Query("limit") limit: number = 10,
        @Query("offset") offset: number = 0,
        @Header("authorization") jwt: string | undefined
    ): Promise<StatementItem[]> {
        const statements = await dbClient<StatementEntity>('statement')
            .where('isPrivate', false)
            .limit(limit)
            .offset(offset)
        return statements.map(e => {
            return {
                id: e.id!,
                name: e.name,
                description: e.description,
                url: e.url,
                input_description: e.input_description,
                type: e.type,
                isPrivate: e.private,
                definition: e.definition,
            }
        })
    }

    @Get('/info')
    public async getInfoByFilter(
        // TODO: queries not used now
        @Query("limit") limit: number = 10,
        @Query("offset") offset: number = 0,
        @Header("authorization") jwt: string | undefined
    ): Promise<StatementInfoItem[]> {
        const statements = await dbClient<StatementEntity>('statement')
        const results = statements.map(async e => {
            return await statementBookInfo(e)
        })
        return Promise.all(results)
    }

    @Get('/statistics')
    public async getStatisticsByFilter(
        // TODO: queries not used now
        @Query("limit") limit: number = 10,
        @Query("offset") offset: number = 0,
        @Header("authorization") jwt: string | undefined
    ): Promise<StatementStatisticsItem[]> {
        const statements = await dbClient<StatementEntity>('statement')
        return statements.map(e => {
            return {
                id: e.id!,
                name: e.name!,
                description: e.description!,
                avgCost: e.avg_cost,
                avgGenerationTime: e.avg_generation_time,
                completed: e.completed,
            }
        })
    }

    @Post()
    public async createStatement(
        @Header("authorization") jwt: string | undefined,
        @Body() request: CreateStatementRequest,
    ): Promise<StatementItem> {
        const userInfo = decodeAuthToken(jwt)
        const entity: StatementEntity = {
            avg_cost: 0,
            avg_generation_time: 0,
            completed: 0,
            created_at: new Date(),
            definition: request.definition,
            description: request.description,
            input_description: request.input_description,
            monitoring: false,
            name: request.name,
            private: request.isPrivate,
            sender_id: userInfo.id,
            type: request.type,
            updated_at: new Date(),
            url: request.url,
            id: undefined,
        }
        const saved = await insert(entity)
        return {
            id: saved.id!,
            name: saved.name,
            description: saved.description,
            url: saved.url,
            input_description: saved.input_description,
            type: saved.type,
            isPrivate: saved.private,
            definition: saved.definition,
        }
    }
}

export interface StatementItem {
    id: number,
    name: string,
    description: string,
    url: string,
    input_description: string,
    type: string,
    isPrivate: boolean,
    definition: any,
}

export interface CreateStatementRequest {
    name: string,
    description: string,
    url: string,
    input_description: string,
    type: string,
    isPrivate: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definition: any,
}

export interface StatementInfoItem {
    id: number,
    name: string,
    description: string,
    open: number,
    close: number,
    current: number,
    min: number,
    max: number,
    dailyChange: number,
    avgCost: number,
    avgGenerationTime: number,
    volume: number,
}

export interface StatementStatisticsItem {
    id: number,
    name: string,
    description: string,
    avgCost: number,
    avgGenerationTime: number,
    // number of completed requests
    completed: number,
}