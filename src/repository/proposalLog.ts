import {dbClient} from '../db/client'

export async function insert(entity: ProposalLongEntity): Promise<ProposalLongEntity> {
	const txIds = await dbClient<ProposalLongEntity>('proposalLog')
		.insert(entity)
		.returning<number[]>('id')
	return {
		...entity,
		id: txIds[0],
	}
}

export interface ProposalLongEntity {
    id: number | null,
    createdAt: Date,
    updatedAt: Date,
    proposalId: number,
    status: string,
}
