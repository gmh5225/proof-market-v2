import {dbClient} from "../db/client";

export async function insert(entity: TransactionEntity): Promise<TransactionEntity> {
    const txIds = await dbClient<TransactionEntity>('transaction')
        .insert(entity)
        .returning<number[]>('id')
    return {
        ...entity,
        id: txIds[0],
    }
}

export interface TransactionEntity {
    id: number | null,
    createdAt: Date,
    updatedAt: Date,
    senderId: number,
    receiverId: number,
    amount: number,
}