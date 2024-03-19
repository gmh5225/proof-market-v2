import {down, up} from "../src/migrations/001_initial_schema";
import {dbClient} from "../src/db/client";
import {findById, insert} from "../src/repository/user";
import request from "supertest";
import {buildApp} from "../src/app";

describe('proposal flow', () => {
    jest.setTimeout(20000)

    beforeEach(async () => {
        await down(dbClient)
        await up(dbClient)
    })

    afterEach(async () => {
        await down(dbClient)
    })

    it('create proposal and get if=t', async () => {
        const userEntity = await insert({
            id: undefined,
            created_at: new Date(),
            address: 'test_address',
            producer: false,
        });

        const fetched = await findById(userEntity.id!);
        expect(fetched?.address).toEqual(userEntity.address)
        expect(fetched?.id).toBeDefined()
    })
})