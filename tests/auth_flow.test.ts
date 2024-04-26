import {down, up} from '../src/migrations/001_initial_schema'
import {dbClient} from '../src/db/client'
import {startApp} from "../src/app";
import request from "supertest";
import {privateKeyToAccount} from "viem/accounts";
import logger from "../src/logger";

describe('auth flow', () => {
	jest.setTimeout(20000)

	beforeEach(async () => {
		await down(dbClient)
		await up(dbClient)
	})

	it('auth user', async () => {
		const app = await startApp();

		const messageResponse = await request(app.callback())
			.get('/user/metamask/message?address=0x4eF7350A35226F683FA78989aaEeE1203E485Ad4')
			.send()
			.expect(200)
		const message = messageResponse.body.msg

		const walletClient = privateKeyToAccount("0xb4f1d55cb2c640305904c085ddf919865510d7da5d1023a919e2330d3db4b055")
		const signature = await walletClient.signMessage({
			message: message,
		})
		logger.info(`Signature: ${signature}`)
		const authResponse = await request(app.callback())
			.post('/user/metamask')
			.send({
				msg: message,
				signRaw: signature,
				addressRaw: "0x4eF7350A35226F683FA78989aaEeE1203E485Ad4",
			})
			.expect(200)
	})
})