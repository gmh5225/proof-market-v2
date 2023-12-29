import {dbClient} from '../db/client'

export async function insert(entity: RequestProposal): Promise<RequestProposal> {
	const txIds = await dbClient<RequestProposal>('requestProposal')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface RequestProposal {
    id: number | undefined,
    createdAt: Date,
    updatedAt: Date,
    statementId: number,
    name: string,
    cost: number,
    requestId: number,
    proposalId: number,
}
