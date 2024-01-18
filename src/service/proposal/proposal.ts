import {dbClient} from "../../db/client";
import {findById as findRequestById, RequestEntity, RequestStatus} from "../../repository/request";
import {CreateProposalRequest, ProposalFilter, ProposalItem} from "../../handler/proposal/proposal";
import {insert, ProposalEntity, ProposalStatus} from "../../repository/proposal";
import {BadRequestError} from "../../handler/error/error";
import {useProposals} from "../../config/props";

export async function getProposals(userId: number, filter: ProposalFilter): Promise<ProposalItem[]> {
    if (useProposals) {
        let builder = dbClient<ProposalEntity>('proposal')
            .where('userId', userId);
        if (filter.status) {
            builder = builder.where('status', ProposalStatus[filter.status])
        }
        if (filter.id) {
            builder = builder
                .where('id', filter.id)
        }
        const proposals = await builder
        return proposals.map(r => {
            return {
                statement_key: r.statementId.toString(),
                request_key: r.requestId!.toString(),
                _key: r.id!.toString(),
                aggregated_mode_id: r.aggregated_mode_id,
                status: r.status,
            }
        })
    } else {
        // Old model
        let builder = dbClient<RequestEntity>('request')
            .where('assignedId', userId);
        if (filter.status) {
                builder = builder
                    .where('status', RequestStatus[filter.status])
        }
        if (filter.id) {
            builder = builder
                .where('id', filter.id)
        }
        const requests = await builder
        return requests.map(r => {
            return {
                statement_key: r.statementId.toString(),
                request_key: r.id!.toString(),
                _key: r.id!.toString(),
                aggregated_mode_id: null,
                status: r.status,
            }
        })
    }
}

export async function createProposal(userId: number, request: CreateProposalRequest) {
    const requestId = parseInt(request.request_id);
    const requestEntity = await findRequestById(requestId);
    if (!requestEntity || requestEntity.status == RequestStatus.NEW) {
        throw new BadRequestError(`No free request with id ${request.request_id}`)
    }
    const proposal = {
        id: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        statementId: requestEntity.statementId,
        cost: request.cost,
        senderId: userId,
        waitPeriod: request.wait_period_in_seconds,
        evalTime: null,
        status: ProposalStatus.NEW,
        matchedTime: null,
        requestId: requestEntity.id!,
        proofId: null,
        generationTime: null,
        aggregatedModeId: request.aggregated_mode_id || null,
    } as ProposalEntity
    const saved = await insert(proposal);
    return {
        statement_key: saved.statementId.toString(),
        request_key: saved.requestId!.toString(),
        _key: saved.id!.toString(),
        aggregated_mode_id: saved.aggregated_mode_id,
        status: saved.status,
    }
}