import {dbClient} from "../../db/client";
import {isProducer} from "../user/producer";
import {minTokensForProducer} from "../../config/props";

export async function userBlockedTokensAmount(userId: number): Promise<number> {
    const costs = await dbClient<RequestEntity>('request')
        .sum('cost as totalCost')
        .where<TotalCostResult[]>('sender', userId.toString())
        .whereNot('status', 'completed');
    const totalCost = costs[0].totalCost as number;
    if (await isProducer(userId)) {
        return totalCost + minTokensForProducer
    }
    return totalCost
}

export interface RequestEntity {
    id: number | null,
    sender: string,
    cost: number,
    status: string,
    statement_key: string,
    input: string,
    proof_key: string,
    createdAt: Date,
    updatedAt: Date | null,
}

type TotalCostResult = {
    totalCost: number;
};
