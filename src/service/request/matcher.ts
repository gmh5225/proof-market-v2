import {schedule} from 'node-cron'
import {dbClient} from '../../db/client'
import {ProducerEntity, update as updateProducer} from '../../repository/producer'
import {RequestEntity, RequestStatus, insert as insertRequest} from '../../repository/request'

export function initRequestMatcher() {
	schedule('*/5 * * * *', async () => {
		await match()
	})
}

export async function match() {
	const producers = await dbClient<ProducerEntity>('producer')
		.where('true', 'true')
		.orderBy('lastAssigned', 'ASC')
	if (!producers) {
		console.warn('No producers found to generate proof')
		return
	}
	const requests= await dbClient<RequestEntity>('request')
		.where('status', RequestStatus.NEW)
	for (const r of requests) {
		const producer = producers[0]
		r.proofId = producer.userId
		r.status = RequestStatus.PENDING
		console.log(`Assign request ${r.id} for producer ${producer.userId}`)
		await insertRequest(r)
		shiftProducers(producers)
		producer.lastAssigned = new Date()
		await updateProducer(producer)
	}
}

function shiftProducers(producers: ProducerEntity[]) {
	const first = producers.shift()
	if (first) {
		producers.push(first)
	}
}
