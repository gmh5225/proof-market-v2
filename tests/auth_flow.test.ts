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
		// const message = "proof_market_0x1B5891A8008569866Ed7Da008f14d685292E84cd_8d50cccdb9529be7bc6c02d9128b04a1_1714147488121"

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