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
Object.defineProperty(exports, "__esModule", { value: true });
const _001_initial_schema_1 = require("../src/migrations/001_initial_schema");
const client_1 = require("../src/db/client");
const user_1 = require("../src/repository/user");
describe('proposal flow', () => {
    jest.setTimeout(20000);
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, _001_initial_schema_1.up)(client_1.dbClient);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, _001_initial_schema_1.down)(client_1.dbClient);
    }));
    it('create proposal and get if=t', () => __awaiter(void 0, void 0, void 0, function* () {
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
});
