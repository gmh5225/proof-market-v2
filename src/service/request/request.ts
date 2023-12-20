import {minTokensForProducer} from '../../config/props'
import {sumTotalCostBySender} from '../../repository/request'
import {findById} from '../../repository/user'

export async function userBlockedTokensAmount(userId: number): Promise<number> {
	const totalCost = await sumTotalCostBySender(userId)
	const user = await findById(userId)
	if (user && user.producer) {
		return totalCost + minTokensForProducer
	}
	return totalCost
}
