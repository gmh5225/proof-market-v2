import {dbClient} from "../db/client";

export async function insert(entity: ProofEntity): Promise<ProofEntity> {
    const txIds = await dbClient<ProofEntity>('proof')
        .insert(entity)
        .returning<number[]>('id')
    return {
        ...entity,
        id: txIds[0],
    }
}

export interface ProofEntity {
    id: number | null,
    createdAt: Date,
    updatedAt: Date,
    proof: string,
    proposalId: number,
    requestId: number,
    generationTime: number,
}
