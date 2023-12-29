import {dbClient} from '../db/client'

export async function insert(entity: TransactionEntity): Promise<TransactionEntity> {
	const txIds = await dbClient<TransactionEntity>('transaction')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface TransactionEntity {
    id: number | undefined,
    createdAt: Date,
    updatedAt: Date,
    senderId: number,
    receiverId: number,
    amount: number,
}