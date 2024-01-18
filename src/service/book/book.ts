import {StatementBook, StatementBookItem} from "../../route/BookController";
import {dbClient} from "../../db/client";
import {ProposalStatus} from "../../repository/proposal";
import {RequestStatus} from "../../repository/request";

export async function statementBook(
    userId: number,
    dc: number,
    dt: number,
    statementId: number,
): Promise<StatementBook> {
    const proposals: StatementBookItem[] = await dbClient('proposal')
        .select(
            dbClient.raw('FLOOR(proposal.cost / ?) * ? AS cost', [dc, dc]),
            dbClient.raw('FLOOR(proposal.eval_time / ?) * ? AS "evalTime"', [dt, dt]),
            dbClient.raw('COUNT(*) AS ordersAmount'),
            dbClient.raw('COUNT(CASE WHEN proposal.sender_id = ? THEN 1 END) AS userOrdersAmount', [userId])
        )
        .where({
            'proposal.statement_id': statementId,
            'proposal.status': ProposalStatus.NEW,
        })
        .groupByRaw('cost')
        .groupByRaw('"evalTime"')

    const requests: StatementBookItem[] = await dbClient('request')
        .select(
            dbClient.raw('FLOOR(request.cost / ?) * ? AS cost', [dc, dc]),
            dbClient.raw('FLOOR(request.eval_time / ?) * ? AS "evalTime"', [dt, dt])
        )
        .count('* as ordersAmount')
        .count({ userOrdersAmount: dbClient.raw('CASE WHEN request.sender_id = ? THEN 1 ELSE NULL END', [userId]) })
        .where({
            'request.statement_id': statementId,
            'request.status': RequestStatus.NEW,
        })
        .groupByRaw('cost')
        .groupByRaw('"evalTime"')
    return {
        requests: requests,
        proposals: proposals,
    }
}