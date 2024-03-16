import {Body, Controller, Get, Header, Path, Post, Route} from "tsoa";
import {dbClient} from "../db/client";
import {insert, StatementEntity} from "../repository/statement";
import {NotFoundError} from "../handler/error/error";
import {decodeAuthToken} from "../service/user/hash";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";

@Route("/statement")
export class StatementController extends Controller {

    // DONE
    @Get('/:id')
    public async getById(
        @Path("id") id: string,
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
            definition: statement.definition,
        }
    }

    // DONE
    @Get()
    public async getByFilter(
        @Query("limit") limit: number = 10,
        @Query("offset") offset: number = 0,
        @Query("owned") owned: boolean = false,
        @Header("authorization") jwt: string | undefined
    ): Promise<StatementItem[]> {
        let queryBuilder = dbClient<StatementEntity>('statement')
        if (owned) {
            const userInfo = decodeAuthToken(jwt)
            queryBuilder = queryBuilder.where('sender_id', userInfo.id)
        }
        const statements = await queryBuilder
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
                definition: e.definition,
            }
        })
    }

    // DONE
    @Post()
    public async createStatement(
        @Header("authorization") jwt: string | undefined,
        @Body() request: CreateStatementRequest,
    ): Promise<StatementItem> {
        const userInfo = decodeAuthToken(jwt)
        const currentStatement = await dbClient<StatementEntity>('statement')
            .where('definition', request.definition)
            .where('type', request.type)
            .first()
            .select();
        if (currentStatement) {
            return {
                id: currentStatement.id!,
                name: currentStatement.name,
                description: currentStatement.description,
                url: currentStatement.url,
                input_description: currentStatement.input_description,
                type: currentStatement.type,
                definition: currentStatement.definition,
            }
        }
        const entity: StatementEntity = {
            created_at: new Date(),
            definition: request.definition,
            description: request.description,
            input_description: request.input_description,
            name: request.name,
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
