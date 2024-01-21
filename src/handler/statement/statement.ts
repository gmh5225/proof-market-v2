
export interface CreateStatementRequest {
    name: string,
    description: string,
    url: string,
    input_description: string,
    type: string,
    isPrivate: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definition: any,
}

