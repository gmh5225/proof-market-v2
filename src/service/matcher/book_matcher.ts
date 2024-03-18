import {dbClient} from "../../db/client";
import {ProposalEntity, ProposalStatus} from "../../repository/proposal";
import {RequestEntity, RequestStatus} from "../../repository/request";
import {BookMatchEntity, BookMatchStatus} from "../../repository/book_match";
import {findById} from "../../repository/statement";
import {schedule} from "node-cron";

export function initRequestMatcher() {
    schedule('*/1 * * * *', async () => {
        try {
            console.log("Start matcher")
            await match()
        } catch (e) {
            console.error(`Matcher error: ${e}`)
        }
    })
}

export async function match() {
    const proposals = await dbClient<ProposalEntity>('proposal')
        .where('status', ProposalStatus[ProposalStatus.NEW])
    const requests = await dbClient<RequestEntity>('request')
        .where('status', RequestStatus[RequestStatus.NEW])

    const proposalsByStatementId = groupByStatementId(proposals)
    const requestsByStatementId = groupByStatementId(requests)

    for (const statementIdStr of Object.keys(proposalsByStatementId)) {
        const statementId = parseInt(statementIdStr)
        console.log(`Find matching for statement ${statementId}`)
        await matchInStatement(
            statementId,
            proposalsByStatementId[statementId] || [],
            requestsByStatementId[statementId] || []
        )
    }
}

async function matchInStatement(
    statementId: number,
    proposals: ProposalEntity[],
    requests: RequestEntity[],
) {
    proposals.sort((a, b) => a.cost - b.cost);
    requests.sort((a, b) => b.cost - a.cost);

    for (const request of requests) {
        const matchingProposalIndex = proposals.findIndex(proposal => proposal.cost <= request.cost);

        if (matchingProposalIndex !== -1) {
            const matchingProposal = proposals[matchingProposalIndex];
            await matchAction(statementId, matchingProposal, request)

            proposals.splice(matchingProposalIndex, 1);
        }
    }
}

function groupByStatementId<T extends { statement_id: number }>(entities: T[]): Record<number, T[]> {
    return entities.reduce((acc: Record<number, T[]>, entity: T) => {
        const statementId = entity.statement_id;
        if (!acc[statementId]) {
            acc[statementId] = [];
        }
        acc[statementId].push(entity);
        return acc;
    }, {});
}

async function matchAction(
    statementId: number,
    proposal: ProposalEntity,
    request: RequestEntity,
) {
    request.status = RequestStatus.PENDING
    request.assigned_id = proposal.sender_id
    request.updated_at = new Date()

    proposal.matched_time = new Date()
    proposal.updated_at = new Date()
    proposal.request_id = request.id!

    const statement = (await findById(statementId))!

    dbClient<RequestEntity>('request').update(request)
    dbClient<ProposalEntity>('proposal').update(proposal)

    const bookMatch = {
        id: undefined,
        created_at: new Date(),
        updated_at: new Date(),
        statement_id: statementId,
        proposal_id: proposal.id!,
        request_id: request.id!,
        cost: request.cost,
        status: BookMatchStatus.ACTIVE,
        proof_id: null,
        input: request.input!,
        definition: statement.definition,
        assigned_id: proposal.sender_id,
    } as BookMatchEntity

    dbClient<BookMatchEntity>('book_match').insert(bookMatch)
}