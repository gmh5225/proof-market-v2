import {dbClient} from '../db/client'

export async function insert(entity: StatementEntity): Promise<StatementEntity> {
	const txIds = await dbClient<StatementEntity>('statement')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export async function findById(id: number): Promise<StatementEntity | undefined> {
    return dbClient<StatementEntity>('statement')
        .where('id', id)
        .first()
}

export interface StatementEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    name: string,
    description: string,
    url: string,
    input_description: string,
    definition: string,
    type: string,
    sender_id: number,
}