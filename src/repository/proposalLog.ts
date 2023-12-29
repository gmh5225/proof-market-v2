import {dbClient} from '../db/client'

export async function insert(entity: ProposalLongEntity): Promise<ProposalLongEntity> {
	const txIds = await dbClient<ProposalLongEntity>('proposalLog')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export interface ProposalLongEntity {
    id: number | undefined,
    createdAt: Date,
    updatedAt: Date,
    proposalId: number,
    status: string,
}
