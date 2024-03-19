import {dbClient} from '../db/client'

export async function insert(entity: ProposalEntity): Promise<ProposalEntity> {
	const txIds = await dbClient<ProposalEntity>('proposal')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface ProposalEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    statement_id: number,
    cost: number,
    sender_id: number,
    waiting_duration_seconds: number,
    max_generation_duration_seconds: number,
    status: ProposalStatus,
    matched_time: Date | null,
    request_id: number | null,
    proof_id: number | null,
    generation_time: number | null,
}

export enum ProposalStatus {
    NEW,
    CHOSEN,
    COMPLETED,
    EXPIRED,
}