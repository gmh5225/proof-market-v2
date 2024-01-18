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
	entity.updated_at = new Date()
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
		.where('user_id', userId)
		.first()
}


export interface ProducerEntity {
    id: number | undefined,
    user_id: number,
    created_at: Date,
    updated_at: Date,
    description: string,
    url: string,
    eth_address: string,
    name: string,
    last_assigned: Date | null,
}
