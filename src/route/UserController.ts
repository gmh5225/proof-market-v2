import {Body, Controller, Get, Header, Post, Route} from 'tsoa'
import {authUser, AuthUser, userDetails, UserDetails} from '../service/user/user'
import {decodeAuthToken} from '../service/user/hash'
import * as crypto from 'crypto'
import {Query} from '@tsoa/runtime/dist/decorators/parameter'
import {getAddress, verifyMessage} from 'viem'

@Route('/user')
export class UserController extends Controller {

	// DONE
	@Get('/metamask/message')
	public async metamaskAuthMessage(
		@Query('address') address: string,
	): Promise<MetamaskAuthMessage> {
		const nonce = crypto.randomBytes(16).toString('hex')
		const expiration = new Date(new Date().getTime() + (60 * 60 * 1000))
		const msg = `proof_market_${address}_${nonce}_${expiration}`
		return {
			msg: msg,
			expiration: expiration,
		}
	}

	// DONE
	@Post('/metamask')
	public async metamaskAuth(
		@Body() request: MetamaskAuthRequest,
	): Promise<AuthUser> {
		const address = getAddress(request.addressRaw)
		const isValid = await verifyMessage({
			address: address,
			message: request.msg,
			signature: `0x${request.signRaw}`,
		})
		if (!isValid) {
			throw new Error('Invalid signature')
		}
		return await authUser(address)

	}

	// DONE
	@Get('/info')
	public async me(
		@Header('Authorization') jwt: string | undefined,
	): Promise<UserDetails> {
		return userDetails(decodeAuthToken(jwt).id)
	}
}

export interface PayRequest {
	sender: number,
	receiver: number,
	amount: number,
}

export interface MetamaskAuthRequest {
	msg: string,
	signRaw: string,
	addressRaw: string,
}

export interface MetamaskAuthMessage {
	msg: string,
	expiration: Date,
}
