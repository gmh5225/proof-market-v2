import {dbClient} from '../db/client'

export async function insert(entity: ProducerEntity): Promise<ProducerEntity> {
	const txIds = await dbClient<ProducerEntity>('producer')
		.insert(entity)
		.returning('id')
	return {
		...entity,
		id: txIds[0].id,
	}
}

export async function update(entity: ProducerEntity): Promise<ProducerEntity> {
	entity.updatedAt = new Date()
	await dbClient<ProducerEntity>('producer')
		.where('id', entity.id!)
		.update(entity)
	return {
		...entity,
	}
}

export async function remove(id: number){
	await dbClient<ProducerEntity>('producer')
		.where('id', id!)
		.delete()
}

export async function findByUserId(userId: number): Promise<ProducerEntity | undefined> {
	return dbClient<ProducerEntity>('producer')
		.where('userId', userId)
		.first()
}


export interface ProducerEntity {
    id: number | undefined,
    userId: number,
    createdAt: Date,
    updatedAt: Date,
    description: string,
    url: string,
    ethAddress: string,
    name: string,
    lastAssigned: Date | null,
}
