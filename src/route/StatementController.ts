import {Body, Controller, Get, Header, Path, Post, Route} from 'tsoa'
import {dbClient} from '../db/client'
import {insert, StatementEntity} from '../repository/statement'
import {NotFoundError} from '../handler/error/error'
import {decodeAuthToken} from '../service/user/hash'
import {Query} from '@tsoa/runtime/dist/decorators/parameter'

@Route('/statement')
export class StatementController extends Controller {

    // DONE
    @Get('/:id')
    public async getById(
        @Path('id') id: string,
    ): Promise<StatementItem> {
        const statement = await dbClient<StatementEntity>('statement')
            .where('id', id)
            .first()
        if (!statement) {
            throw new NotFoundError('Statement not found')
        }
        return mapStatement(statement)
    }

    // DONE
    @Get()
    public async getByFilter(
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0,
        @Query('owned') owned: boolean = false,
        @Header('authorization') jwt: string | undefined,
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
            return mapStatement(e)
        })
    }

    // DONE
    @Post()
    public async createStatement(
        @Header('authorization') jwt: string | undefined,
        @Body() request: CreateStatementRequest,
    ): Promise<StatementItem> {
        const userInfo = decodeAuthToken(jwt)
        const currentStatement = await dbClient<StatementEntity>('statement')
            .where('definition', request.definition)
            .where('type', request.type)
            .first()
            .select()
        if (currentStatement) {
            return mapStatement(currentStatement)
        }
        const entity: StatementEntity = {
            created_at: new Date(),
            definition: JSON.stringify(request.definition),
            description: request.description,
            input_description: request.inputDescription,
            name: request.name,
            sender_id: userInfo.id,
            type: request.type,
            updated_at: new Date(),
            url: request.url,
            id: undefined,
        }
        const saved = await insert(entity)
        return mapStatement(saved)
    }
}

function mapStatement(entity: StatementEntity): StatementItem {
    const definition = JSON.parse(entity.definition);
    return {
        id: entity.id!,
        name: entity.name,
        description: entity.description,
        url: entity.url,
        inputDescription: entity.input_description,
        type: entity.type,
        definition: {
            verificationKey: definition.verificationKey!,
            provingKey: definition.provingKey!,
        },
    }
}

export interface StatementItem {
    id: number,
    name: string,
    description: string,
    url: string,
    inputDescription: string,
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definition: StatementItemDefinition,
}

export interface StatementItemDefinition {
    verificationKey: string,
    provingKey: string,
}

export interface CreateStatementRequest {
    name: string,
    description: string,
    url: string,
    inputDescription: string,
    type: string,
    isPrivate: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definition: StatementItemDefinition,
}
