import {RequestStatus} from "../../repository/request";

export interface ProposalFilter {
    id: number | undefined,
    status: RequestStatus | undefined,
}

export interface ProposalItem {
    statement_key: string,
    request_key: string,
    _key: string,
}

export interface CreateProposalRequest {
    request_id: string,
    cost: number,
    aggregated_mode_id: number | undefined,
    wait_period_in_seconds: number,
}
