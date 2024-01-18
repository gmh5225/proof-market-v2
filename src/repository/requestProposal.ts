import {dbClient} from '../db/client'

export async function insert(entity: RequestProposal): Promise<RequestProposal> {
	const txIds = await dbClient<RequestProposal>('request_proposal')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface RequestProposal {
    id: number | undefined,
    created_at: Date,
    updated_at: Date,
    statement_id: number,
    name: string,
    cost: number,
    request_id: number,
    proposal_id: number,
}
