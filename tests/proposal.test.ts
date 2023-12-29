import {down, up} from "../src/migrations/001_initial_schema";
import {dbClient} from "../src/db/client";
import {findById, insert} from "../src/repository/user";
import request from "supertest";
import {buildApp} from "../src/app";

describe('proposal flow', () => {
    jest.setTimeout(20000)

    beforeEach(async () => {
        await up(dbClient)
    })

    afterEach(async () => {
        await down(dbClient)
    })

    it('create proposal and get if=t', async () => {
        const userEntity = await insert({
            id: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            login: 'test user',
            password: 'pass hash',
            email: 'test@test.com',
            balance: BigInt(0),
            producer: false,
        });

        const fetched = await findById(userEntity.id!);
        expect(fetched?.login).toEqual(userEntity.login)
        expect(fetched?.id).toBeDefined()
    })
})