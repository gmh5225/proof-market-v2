import {dbClient} from '../db/client'

export async function insert(entity: BookMatchEntity): Promise<BookMatchEntity> {
	const txIds = await dbClient<BookMatchEntity>('book_match')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface BookMatchEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    statement_id: number,
    proposal_id: number,
    request_id: number,
    cost: number,
    status: BookMatchStatus,
    proof_id: number | null,
    input: string,
    definition: string,
    assigned_id: number,
}

export enum BookMatchStatus {
    ACTIVE,
    FAILED,
    EXPIRED,
    FINISHED,
}