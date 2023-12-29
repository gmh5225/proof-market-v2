import {dbClient} from '../db/client'

export async function insert(entity: RequestEntity): Promise<RequestEntity> {
	const txIds = await dbClient<RequestEntity>('request')
		.insert(entity)
		.returning<number[]>('id')
	return {
		...entity,
		id: txIds[0],
	}
}

export async function update(entity: RequestEntity): Promise<RequestEntity> {
	entity.updatedAt = new Date()
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
		.where<TotalCostResult[]>('senderId', senderId)
		.whereNot('status', 'completed')
	return costs[0].totalCost as number
}

export interface RequestEntity {
    id: number | undefined,
    createdAt: Date,
    updatedAt: Date,
    statementId: number,
    cost: number,
    evalTime: number | null,
    waitPeriod: number | null,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    senderId: number,
    status: RequestStatus,
    proofId: number | null,
	assignedId: number | null,
	aggregatedModeId: number | null,
}

type TotalCostResult = {
    totalCost: number;
};

export enum RequestStatus {
    NEW,
    PENDING,
    DONE,
}