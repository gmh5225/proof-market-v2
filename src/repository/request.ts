import {dbClient} from "../db/client";

export async function sumTotalCostBySender(senderId: number): Promise<number> {
    const costs = await dbClient<RequestEntity>('request')
        .sum('cost as totalCost')
        .where<TotalCostResult[]>('senderId', senderId)
        .whereNot('status', 'completed');
    return costs[0].totalCost as number
}

export interface RequestEntity {
    id: number | null,
    createdAt: Date,
    updatedAt: Date,
    statementId: number,
    cost: number,
    evalTime: number,
    waitPeriod: number
    input: any,
    senderId: number,
    status: string,
    proofId: string,
    proposalId: number | null,
}

type TotalCostResult = {
    totalCost: number;
};