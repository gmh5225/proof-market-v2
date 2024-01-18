import {dbClient} from '../db/client'

export async function insert(entity: ProofEntity): Promise<ProofEntity> {
	const ids = await dbClient('proof')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: ids[0].id,
	}
}

export async function findById(id: number): Promise<ProofEntity | undefined> {
	return dbClient<ProofEntity>('proof')
		.where('id', id)
		.first()
}

export interface ProofEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    proof: string,
    request_id: number,
    producer_id: number | null,
    generation_time: number,
}
