import {dbClient} from '../db/client'

export async function existsById(id: number): Promise<boolean> {
	const user = await dbClient<UserEntity>('user')
		.where('id', id)
		.first()
	return !(!user)
}

export async function findByAddress(address: string): Promise<UserEntity | undefined> {
	return dbClient<UserEntity>('user')
		.where('address', address)
		.first()
}

export async function findById(id: number): Promise<UserEntity | undefined> {
	return dbClient<UserEntity>('user')
		.where('id', id)
		.first()
}

export async function insert(entity: UserEntity): Promise<UserEntity> {
	const ids = await dbClient<UserEntity>('user')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: ids[0].id,
	}
}

export async function update(entity: UserEntity): Promise<UserEntity> {
	await dbClient<UserEntity>('user')
		.where('id', entity.id!)
		.update(entity)
	return {
		...entity,
	}
}

export interface UserEntity {
    id: number | undefined
    address: string
    created_at: Date
    producer: boolean
}