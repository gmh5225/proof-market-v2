import {StatementBook, StatementBookItem} from "../../route/BookController";
import {dbClient} from "../../db/client";
import {ProposalEntity, ProposalStatus} from "../../repository/proposal";
import {RequestStatus} from "../../repository/request";
import {StatementEntity} from "../../repository/statement";
import {StatementInfoItem} from "../../route/StatementController";

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
        .count({userOrdersAmount: dbClient.raw('CASE WHEN request.sender_id = ? THEN 1 ELSE NULL END', [userId])})
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

export async function statementBookInfo(statement: StatementEntity): Promise<StatementInfoItem> {
    const proposals = await dbClient<ProposalEntity>('proposal')
        .where('status', 'DONE')
        .andWhere('statement_key', statement.id!)
        .andWhere('updatedOn', '>=', dbClient.raw('CURRENT_DATE - INTERVAL \'1 DAY\''))
        .orderBy('updatedOn', 'asc')
        .select();

    if (proposals.length === 0) {
        return {
            id: statement.id!,
            name: statement.name,
            description: statement.description,
            open: -1,
            close: -1,
            current: -1,
            min: -1,
            max: -1,
            dailyChange: 0,
            avgCost: -1,
            avgGenerationTime: -1,
            volume: -1,
        };
    }

    const open = proposals[0].cost;
    const close = proposals[proposals.length - 1].cost;
    const minCost = Math.min(...proposals.map(p => p.cost));
    const maxCost = Math.max(...proposals.map(p => p.cost));
    const avgCost = proposals.reduce((sum, p) => sum + p.cost, 0) / proposals.length;
    const avgGenerationTime = proposals.reduce((sum, p) => sum + (p.generation_time || 0), 0) / proposals.length;
    const dailyChange = ((close - open) / open) * 100;
    const volume = proposals.length;

    return {
        id: statement.id!,
        name: statement.name,
        description: statement.description,
        open: open,
        close: close,
        current: close,
        min: minCost,
        max: maxCost,
        dailyChange: dailyChange,
        avgCost: avgCost,
        avgGenerationTime: avgGenerationTime,
        volume: volume,
    };
}
