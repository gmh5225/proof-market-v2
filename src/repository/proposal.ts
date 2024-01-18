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
    wait_period: number,
    eval_time: number | null,
    status: ProposalStatus,
    matched_time: Date | null,
    request_id: number,
    proof_id: number | null,
    generation_time: number | null,
    aggregated_mode_id: number | null,
}

export enum ProposalStatus {
    NEW,
    CHOSEN,
    COMPLETED,
    EXPIRED,
}