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

export interface StatementEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    name: string,
    description: string,
    url: string,
    input_description: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definition: any,
    type: string,
    sender_id: number,
}