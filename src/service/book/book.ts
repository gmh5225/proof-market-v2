import {StatementBook} from '../../route/BookController'
import {dbClient} from '../../db/client'
import {ProposalEntity, ProposalStatus} from '../../repository/proposal'
import {RequestEntity, RequestStatus} from '../../repository/request'
import {BookMatchEntity, BookMatchStatus} from '../../repository/book_match'

export async function statementBook(
	statementId: number,
): Promise<StatementBook> {
	const proposals = await dbClient<ProposalEntity>('proposal')
		.where('status', ProposalStatus.NEW)
		.where('statement_id', statementId)
		.orderBy('cost', 'asc')
		.select()
	const requests = await dbClient<RequestEntity>('request')
		.where('status', RequestStatus.NEW)
		.where('statement_id', statementId)
		.orderBy('cost', 'desc')
		.select()
	const processingMatchCount = await dbClient('book_match')
		.where('statement_id', statementId)
		.where('status', BookMatchStatus.ACTIVE)
		.count<SqlCountResult[]>()
	const lastMatch = await dbClient<BookMatchEntity>('book_match')
		.where('statement_id', statementId)
		.where('status', BookMatchStatus.FINISHED)
		.first()
		.select()
	return {
		proposals: proposals.map(p => {
			return {
				cost: p.cost,
				createdAt: p.created_at,
			}
		}),
		requests: requests.map(r => {
			return {
				cost: r.cost,
				createdAt: r.created_at,
			}
		}),
		lastMatchCost: lastMatch?.cost || null,
		instantMatchCost: proposals[0]?.cost || null,
		processingMatchCount: parseInt(processingMatchCount[0].count),
	}
}

interface SqlCountResult {
    count: string,
}