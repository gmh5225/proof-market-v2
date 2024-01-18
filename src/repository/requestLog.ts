import {dbClient} from '../db/client'
import {RequestStatus} from "./request";

export async function insert(entity: RequestLogEntity): Promise<RequestLogEntity> {
	const txIds = await dbClient<RequestLogEntity>('request_log')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface RequestLogEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    request_id: number,
    status: RequestStatus,
}
