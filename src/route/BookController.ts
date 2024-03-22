import {Controller, Get, Header, Path, Route} from 'tsoa'
import {statementBook} from '../service/book/book'
import {dbClient} from '../db/client'
import {BookMatchEntity, BookMatchStatus} from '../repository/book_match'
import {decodeAuthToken} from '../service/user/hash'

@Route('/book')
export class BookController extends Controller {

	// DONE
	@Get('/:statementId')
	public async statementBook(
		@Path('statementId') statementId: number,
	): Promise<StatementBook> {
		return statementBook(statementId)
	}

	@Get('/assigned')
	public async assigned(
		@Header('authorization') jwt: string,
	): Promise<BookAssignedItem[]> {
		const userInfo = decodeAuthToken(jwt)
		const matches = await dbClient<BookMatchEntity>('book_match')
			.where('assigned_id', userInfo.id)
			.where('status', BookMatchStatus[BookMatchStatus.ACTIVE])
			.orderBy('created_at', 'desc')
			.select()
		return matches.map(m => {
			return {
				id: m.id!,
				statementId: m.statement_id,
				requestId: m.request_id,
				proposalId: m.proposal_id,
				input: m.input,
				definition: m.definition,
				matchedAt: m.created_at,
			}
		})
	}
}

export interface StatementBook {
	proposals: StatementBookItem[],
	requests: StatementBookItem[],
	lastMatchCost: number | null,
	instantMatchCost: number | null,
	processingMatchCount: number,
}

export interface StatementBookItem {
	cost: number,
	createdAt: Date,
}

export interface BookAssignedItem {
	id: number,
	proposalId: number,
	requestId: number,
	statementId: number,
	input: string,
	definition: string,
	matchedAt: Date,
}
