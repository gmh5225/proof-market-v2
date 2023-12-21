import {dbClient} from '../db/client'

export async function insert(entity: RequestLogEntity): Promise<RequestLogEntity> {
	const txIds = await dbClient<RequestLogEntity>('requestLog')
		.insert(entity)
		.returning<number[]>('id')
	return {
		...entity,
		id: txIds[0],
	}
}

export interface RequestLogEntity {
    id: number | undefined,
    createdAt: Date,
    updatedAt: Date,
    requestId: number,
    status: string,
}
