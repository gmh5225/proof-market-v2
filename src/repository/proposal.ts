import {dbClient} from '../db/client'

export async function insert(entity: ProposalEntity): Promise<ProposalEntity> {
	const txIds = await dbClient<ProposalEntity>('proposal')
		.insert(entity)
		.returning<number[]>('id')
	return {
		...entity,
		id: txIds[0],
	}
}

export interface ProposalEntity {
    id: number | undefined,
    createdAt: Date,
    updatedAt: Date,
    statementId: number,
    cost: number,
    senderId: number,
    waitPeriod: number,
    evalTime: number,
    status: string,
    matchedTime: Date | null,
    requestId: number,
    proofId: number,
    generationTime: number,
}
