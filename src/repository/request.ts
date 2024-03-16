import {dbClient} from '../db/client'

export async function insert(entity: RequestEntity): Promise<RequestEntity> {
	const txIds = await dbClient<RequestEntity>('request')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export async function update(entity: RequestEntity): Promise<RequestEntity> {
	entity.updated_at = new Date()
	await dbClient<RequestEntity>('request')
		.where('id', entity.id!)
		.update(entity)
	return {
		...entity,
	}
}

export async function findById(id: number): Promise<RequestEntity | undefined> {
	return dbClient<RequestEntity>('request')
		.where('id', id)
		.first()
}

export async function sumTotalCostBySender(senderId: number): Promise<number> {
	const costs = await dbClient<RequestEntity>('request')
		.sum('cost as totalCost')
		.where<TotalCostResult[]>('sender_id', senderId)
		.whereNot('status', 'DONE')
	return costs[0].totalCost as number
}

export interface RequestEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    statement_id: number,
    cost: number,
    eval_time: number | null,
    wait_period: number | null,
    input: string,
    sender_id: number,
    status: RequestStatus,
    proof_id: number | null,
	assigned_id: number | null,
	aggregated_mode_id: number | null,
}

type TotalCostResult = {
    totalCost: number;
};

export enum RequestStatus {
    NEW,
    PENDING,
    DONE,
}