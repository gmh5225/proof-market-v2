import {Controller, Header, Post, Route} from 'tsoa'
import {decodeAuthToken} from '../service/user/hash'
import {findById, update as updateUser} from '../repository/user'
import {BadRequestError} from '../handler/error/error'

@Route('/producer')
export class ProducerController extends Controller {

	@Post('/register')
	public async register(
		@Header('authorization') jwt: string | undefined,
	): Promise<RegisterProducerResponse> {
		const userInfo = decodeAuthToken(jwt)
		const user = await findById(userInfo.id)
		if (!user) {
			throw new BadRequestError('User not found')
		}
		user.producer = true
		await updateUser(user)
		return {
			id: userInfo.id,
			result: true,
		}
	}

	@Post('/deregister')
	public async deregister(
		@Header('authorization') jwt: string | undefined,
	): Promise<RegisterProducerResponse> {
		const userInfo = decodeAuthToken(jwt)
		const user = await findById(userInfo.id)
		if (!user) {
			throw new BadRequestError('User not found')
		}
		user.producer = false
		await updateUser(user)
		return {
			id: userInfo.id,
			result: true,
		}
	}
}

export interface RegisterProducerResponse {
	id: number,
	result: boolean,
}
