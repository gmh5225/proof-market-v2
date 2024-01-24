import {dbClient} from "../../db/client";
import {findById as findRequestById, RequestEntity, RequestStatus} from "../../repository/request";
import {insert, ProposalEntity, ProposalStatus} from "../../repository/proposal";
import {BadRequestError} from "../../handler/error/error";
import {useProposals} from "../../config/props";
import {CreateProposalRequest, ProposalFilter, ProposalItem} from "../../route/ProposalController";

export async function getProposals(
    userId: number,
    filter: ProposalFilter,
    limit: number,
    offset: number,
): Promise<ProposalItem[]> {
    if (useProposals) {
        let builder = dbClient<ProposalEntity>('proposal')
            .where('userId', userId)
        if (filter.status) {
            builder = builder.where('status', ProposalStatus[filter.status])
        }
        if (filter.id) {
            builder = builder
                .where('id', filter.id)
        }
        const proposals = await builder.limit(limit).offset(offset)
        return proposals.map(r => {
            return {
                statement_key: r.statement_id.toString(),
                request_key: r.request_id!.toString(),
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
                statement_key: r.statement_id.toString(),
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
        created_at: new Date(),
        updated_at: new Date(),
        statement_id: requestEntity.statement_id,
        cost: request.cost,
        sender_id: userId,
        wait_period: request.wait_period_in_seconds,
        eval_time: null,
        status: ProposalStatus.NEW,
        matched_time: null,
        request_id: requestEntity.id!,
        proof_id: null,
        generation_time: null,
        aggregated_mode_id: request.aggregated_mode_id || null,
    } as ProposalEntity
    const saved = await insert(proposal);
    return {
        statement_key: saved.statement_id.toString(),
        request_key: saved.request_id!.toString(),
        _key: saved.id!.toString(),
        aggregated_mode_id: saved.aggregated_mode_id,
        status: saved.status,
    }
}

export async function deleteProposal(id: number, userId: number) {
    const result = await dbClient<ProposalEntity>('proposal')
        .delete()
        .where('id', id)
        .where('sender_id', userId)
    if (result < 1) {
        throw new BadRequestError('Proposal not found')
    }
}