import Application from 'koa'
import {insert, StatementEntity} from '../../repository/statement'
import {decodeJwt} from '../../service/user/hash'
import {dbClient} from '../../db/client'

export async function getStatementHandler(ctx: Application.ParameterizedContext) {
	const id = ctx.params.id
	const statement = await dbClient<StatementEntity>('statement')
		.where('id', id)
		.first()
	if (!statement) {
		ctx.status = 404
		return
	}
	ctx.body = {
		id: statement.id!,
		name: statement.name,
		description: statement.description,
		url: statement.url,
		input_description: statement.inputDescription,
		type: statement.type,
		isPrivate: statement.private,
		definition: statement.definition,
	}
}

export async function getStatementsHandler(ctx: Application.ParameterizedContext) {
	const statements = await dbClient<StatementEntity>('statement')
		.where('isPrivate', false)
	ctx.body = statements.map(e => {
		return {
			id: e.id!,
			name: e.name,
			description: e.description,
			url: e.url,
			input_description: e.inputDescription,
			type: e.type,
			isPrivate: e.private,
			definition: e.definition,
		}
	})
}

export async function createStatementHandler(ctx: Application.ParameterizedContext) {
	const userInfo = decodeJwt(ctx.request)
	const request = ctx.request.body as CreateStatementRequest
	const entity: StatementEntity = {
		avgCost: 0,
		avgGenerationTime: 0,
		completed: false,
		createdAt: new Date(),
		definition: request.definition,
		description: request.description,
		inputDescription: request.input_description,
		monitoring: false,
		name: request.name,
		private: request.isPrivate,
		senderId: userInfo.id,
		type: request.type,
		updatedAt: new Date(),
		url: request.url,
		id: undefined,
	}
	const saved = await insert(entity)
	ctx.body = {
		id: saved.id,
	}
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