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
    //
    // afterEach(async () => {
    //     await down(dbClient)
    // })

    it('get book for statement', async () => {
        const userEntity = await insertUser({
            id: undefined,
            created_at: new Date(),
            updated_at: new Date(),
            login: 'test user',
            password: 'pass hash',
            email: 'test@test.com',
            balance: BigInt(0),
            producer: false,
        });

        const statement = await insertStatement({
            avg_cost: 0,
            avg_generation_time: 0,
            completed: false,
            created_at: new Date(),
            definition: {},
            description: "description",
            id: undefined,
            input_description: "inputDescription",
            monitoring: false,
            name: "statement",
            private: false,
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
            input: {},
            proof_id: null,
            sender_id: userEntity.id!,
            statement_id: statement.id!,
            status: RequestStatus.NEW,
            updated_at: new Date(),
            wait_period: 1,
        });

        const proposalEntity = await insertProposal({
            aggregated_mode_id: null,
            cost: 0,
            created_at: new Date(),
            eval_time: 1,
            generation_time: 1,
            id: undefined,
            matched_time: new Date(),
            proof_id: null,
            request_id: requestEntity.id!,
            sender_id: userEntity.id!,
            statement_id: statement.id!,
            status: ProposalStatus.NEW,
            updated_at: new Date(),
            wait_period: 1
        });

        const book = await statementBook(
            userEntity.id!,
            1,
            1,
            statement.id!
        );

        expect(book.proposals.length).toEqual(1)
        expect(book.requests.length).toEqual(1)
    })
})