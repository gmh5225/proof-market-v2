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
    createdAt: Date,
    updatedAt: Date,
    name: string,
    description: string,
    url: string,
    inputDescription: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definition: any,
    type: string,
    private: boolean,
    senderId: number,
    monitoring: boolean,
    completed: boolean,
    avgGenerationTime: number,
    avgCost: number,
}