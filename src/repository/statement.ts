import {dbClient} from "../db/client";

export async function insert(entity: StatementEntity): Promise<StatementEntity> {
    const txIds = await dbClient<StatementEntity>('statement')
        .insert(entity)
        .returning<number[]>('id')
    return {
        ...entity,
        id: txIds[0],
    }
}

export interface StatementEntity {
    id: number | null,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    description: string,
    url: string,
    inputDescription: string,
    definition: any,
    type: string,
    private: boolean,
    senderId: number,
    monitoring: boolean,
    completed: boolean,
    avgGenerationTime: number,
    avgCost: number,
}