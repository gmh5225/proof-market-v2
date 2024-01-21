import {Body, Controller, Get, Header, Path, Post, Route} from "tsoa";
import {dbClient} from "../db/client";
import {insert, StatementEntity} from "../repository/statement";
import {NotFoundError} from "../handler/error/error";
import {decodeAuthToken} from "../service/user/hash";
import {CreateStatementRequest} from "../handler/statement/statement";

@Route("/statement")
export class StatementController extends Controller {

    @Get("/:id")
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
        @Header("authorization") jwt: string | undefined
    ): Promise<StatementItem[]> {
        const statements = await dbClient<StatementEntity>('statement')
            .where('isPrivate', false)
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

    @Post()
    public async createStatement(
        @Header("authorization") jwt: string | undefined,
        @Body() request: CreateStatementRequest,
    ): Promise<StatementItem> {
        const userInfo = decodeAuthToken(jwt)
        const entity: StatementEntity = {
            avg_cost: 0,
            avg_generation_time: 0,
            completed: false,
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