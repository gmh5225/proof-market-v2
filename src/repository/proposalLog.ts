import {dbClient} from '../db/client'

export async function insert(entity: ProposalLongEntity): Promise<ProposalLongEntity> {
	const txIds = await dbClient<ProposalLongEntity>('proposal_log')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface ProposalLongEntity {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    proposal_id: number,
    status: string,
}
