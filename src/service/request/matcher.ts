import {schedule} from 'node-cron'
import {dbClient} from '../../db/client'
import {ProducerEntity, update as updateProducer} from '../../repository/producer'
import {RequestEntity, RequestStatus, update as updateRequest} from '../../repository/request'

export function initRequestMatcher() {
	schedule('*/1 * * * *', async () => {
		try {
			console.log("Start matcher")
			await match()
		} catch (e) {
			console.error(`Matcher error: ${e}`)
		}
	})
}

export async function match() {
	// Change logic to proposals
	const producers = await dbClient<ProducerEntity>('producer')
		.orderBy('lastAssigned', 'ASC')
	if (!producers) {
		console.warn('No producers found to generate proof')
		return
	}
	const requests= await dbClient<RequestEntity>('request')
		.where('status', RequestStatus.NEW)
	console.log(`Found requests ${requests}`)
	for (const r of requests) {
		const noAssignedProducer = producers.find(p => p.lastAssigned == null);
		let producer;
		if (noAssignedProducer) {
			producer = noAssignedProducer;
		} else {
			producer = producers[0]
		}
		r.assignedId = producer.userId
		r.status = RequestStatus.PENDING
		r.input = JSON.stringify(r.input)
		console.log(`Assign request ${r.id} for producer ${producer.userId}`)
		await updateRequest(r)
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
