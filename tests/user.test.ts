import {down, up} from "../src/migrations/001_initial_schema";
import {dbClient} from "../src/db/client";
import {findById, insert} from "../src/repository/user";
import request from "supertest";
import {buildApp} from "../src/app";

describe('user model flow', () => {
    jest.setTimeout(20000)

    beforeEach(async () => {
        await down(dbClient)
        await up(dbClient)
    })

    afterEach(async () => {
        await down(dbClient)
    })

    it('insert user', async () => {
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

    it('sign up + sign in', async () => {
        const signupRequest = {
            user: 'login',
            passwd: 'passwd',
            email: 'email@test.com'
        }
        const response = await request(buildApp().callback())
            .post('/user/signup')
            .send(signupRequest)
            .expect(200);
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('jwt')

        const response2 = await request(buildApp().callback())
            .post('/user/signin')
            .send({
                username: signupRequest.user,
                password: signupRequest.passwd
            })
            .expect(200);
        expect(response2.body).toHaveProperty('id')
        expect(response2.body).toHaveProperty('jwt')
    })

    it('register as producer', async () => {
        const signupRequest = {
            user: 'login',
            passwd: 'passwd',
            email: 'email@test.com'
        }
        const authResponse = await request(buildApp().callback())
            .post('/user/signup')
            .send(signupRequest)
            .expect(200);

        const response2 = await request(buildApp().callback())
            .post('/producer')
            .set('authorization', authResponse.body.jwt)
            .send({
                name: 'producer1',
                description: 'test desc',
                url: 'http://test.test',
                ethAddress: 'no',
            })
            .expect(200);
    })

    it('user exists', async () => {
        const signupRequest = {
            user: 'login',
            passwd: 'passwd',
            email: 'email@test.com'
        }
        const authResponse = await request(buildApp().callback())
            .post('/user/signup')
            .send(signupRequest)
            .expect(200);

        const response2 = await request(buildApp().callback())
            .head(`/user/exists/${signupRequest.user}`)
            .set('authorization', authResponse.body.jwt)
            .send()
            .expect(200);
    })
})