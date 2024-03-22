import {down, up} from '../src/migrations/001_initial_schema'
import {dbClient} from '../src/db/client'
import {findById, insert} from '../src/repository/user'

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
			created_at: new Date(),
			address: 'test_address',
			producer: false,
		})

		const fetched = await findById(userEntity.id!)
		expect(fetched?.address).toEqual(userEntity.address)
		expect(fetched?.id).toBeDefined()
	})

	it('metamask signin', async () => {
		// const response = await request(buildApp().callback())
		//     .post('/user/signup')
		//     .send(signupRequest)
		//     .expect(200);
		// expect(response.body).toHaveProperty('id')
		// expect(response.body).toHaveProperty('jwt')
	})
})