import {dbClient} from '../db/client'

export async function insert(entity: ProofEntity): Promise<ProofEntity> {
	const txIds = await dbClient<ProofEntity>('proof')
		.insert(entity)
		.returning<number[]>('id')
	return {
		...entity,
		id: txIds[0],
	}
}

export async function findById(id: number): Promise<ProofEntity | undefined> {
	return dbClient<ProofEntity>('proof')
		.where('id', id)
		.first()
}

export interface ProofEntity {
    id: number | null,
    createdAt: Date,
    updatedAt: Date,
    proof: string,
    proposalId: number | null,
    requestId: number,
    producerId: number | null,
    generationTime: number,
}
