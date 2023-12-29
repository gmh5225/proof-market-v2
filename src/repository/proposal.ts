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
    createdAt: Date,
    updatedAt: Date,
    statementId: number,
    cost: number,
    senderId: number,
    waitPeriod: number,
    evalTime: number | null,
    status: ProposalStatus,
    matchedTime: Date | null,
    requestId: number,
    proofId: number | null,
    generationTime: number | null,
    aggregated_mode_id: number | null,
}

export enum ProposalStatus {
    NEW,
    CHOSEN,
    COMPLETED,
    EXPIRED,
}