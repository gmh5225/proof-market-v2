"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _001_initial_schema_1 = require("../src/migrations/001_initial_schema");
const client_1 = require("../src/db/client");
const user_1 = require("../src/repository/user");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
describe('user model flow', () => {
    jest.setTimeout(20000);
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, _001_initial_schema_1.up)(client_1.dbClient);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, _001_initial_schema_1.down)(client_1.dbClient);
    }));
    it('insert user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userEntity = yield (0, user_1.insert)({
            id: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            login: 'test user',
            password: 'pass hash',
            email: 'test@test.com',
            balance: BigInt(0),
            producer: false,
        });
        const fetched = yield (0, user_1.findById)(userEntity.id);
        expect(fetched === null || fetched === void 0 ? void 0 : fetched.login).toEqual(userEntity.login);
        expect(fetched === null || fetched === void 0 ? void 0 : fetched.id).toBeDefined();
    }));
    it('sign up + sign in', () => __awaiter(void 0, void 0, void 0, function* () {
        const signupRequest = {
            user: 'login',
            passwd: 'passwd',
            email: 'email@test.com'
        };
        const response = yield (0, supertest_1.default)((0, app_1.buildApp)().callback())
            .post('/user/signup')
            .send(signupRequest)
            .expect(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('jwt');
        const response2 = yield (0, supertest_1.default)((0, app_1.buildApp)().callback())
            .post('/user/signin')
            .send({
            username: signupRequest.user,
            password: signupRequest.passwd
        })
            .expect(200);
        expect(response2.body).toHaveProperty('id');
        expect(response2.body).toHaveProperty('jwt');
    }));
    it('register as producer', () => __awaiter(void 0, void 0, void 0, function* () {
        const signupRequest = {
            user: 'login',
            passwd: 'passwd',
            email: 'email@test.com'
        };
        const authResponse = yield (0, supertest_1.default)((0, app_1.buildApp)().callback())
            .post('/user/signup')
            .send(signupRequest)
            .expect(200);
        const response2 = yield (0, supertest_1.default)((0, app_1.buildApp)().callback())
            .post('/producer')
            .set('authorization', authResponse.body.jwt)
            .send({
            name: 'producer1',
            description: 'test desc',
            url: 'http://test.test',
            ethAddress: 'no',
        })
            .expect(200);
    }));
    it('user exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const signupRequest = {
            user: 'login',
            passwd: 'passwd',
            email: 'email@test.com'
        };
        const authResponse = yield (0, supertest_1.default)((0, app_1.buildApp)().callback())
            .post('/user/signup')
            .send(signupRequest)
            .expect(200);
        const response2 = yield (0, supertest_1.default)((0, app_1.buildApp)().callback())
            .head(`/user/exists/${signupRequest.user}`)
            .set('authorization', authResponse.body.jwt)
            .send()
            .expect(200);
    }));
});
