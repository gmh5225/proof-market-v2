import {down, up} from "../src/migrations/001_initial_schema";
import {dbClient} from "../src/db/client";
import {insert as insertUser} from "../src/repository/user";
import {insert as insertStatement} from "../src/repository/statement";
import {insert as insertRequest, RequestStatus} from "../src/repository/request";
import {insert as insertProposal, ProposalStatus} from "../src/repository/proposal";
import {statementBook} from "../src/service/book/book";

describe('book flow', () => {
    jest.setTimeout(20000)

    beforeEach(async () => {
        await down(dbClient)
        await up(dbClient)
    })

    it('get book for statement', async () => {
        const userEntity = await insertUser({
            id: undefined,
            created_at: new Date(),
            address: "address",
            producer: false,
        });

        const statement = await insertStatement({
            created_at: new Date(),
            definition: "{}",
            description: "description",
            id: undefined,
            input_description: "inputDescription",
            name: "statement",
            sender_id: userEntity.id!,
            type: "type",
            updated_at: new Date(),
            url: "url.com",
        });

        const requestEntity = await insertRequest({
            aggregated_mode_id: null,
            assigned_id: userEntity.id!,
            cost: 0,
            created_at: new Date(),
            eval_time: 1,
            id: undefined,
            input: "{}",
            proof_id: null,
            sender_id: userEntity.id!,
            statement_id: statement.id!,
            status: RequestStatus.NEW,
            updated_at: new Date(),
            wait_period: 1,
        });

        const proposalEntity = await insertProposal({
            cost: 0,
            created_at: new Date(),
            generation_time: 1,
            id: undefined,
            matched_time: new Date(),
            proof_id: null,
            request_id: requestEntity.id!,
            sender_id: userEntity.id!,
            statement_id: statement.id!,
            status: ProposalStatus.NEW,
            updated_at: new Date(),
            waiting_duration_seconds: 100,
            max_generation_duration_seconds: 100,
        });

        const book = await statementBook(
            statement.id!
        );

        expect(book.proposals.length).toEqual(1)
        expect(book.requests.length).toEqual(1)
    })
})