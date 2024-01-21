
export interface CreateRequestRequest {
    statement_key: number,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    cost: number,
	aggregatedModeId: number | undefined,
}
