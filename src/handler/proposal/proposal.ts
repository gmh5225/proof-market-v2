import Application from 'koa'
import {dbClient} from "../../db/client";
import {decodeJwt} from "../../service/user/hash";
import {RequestEntity, RequestStatus} from "../../repository/request";

export async function getProposals(ctx: Application.ParameterizedContext) {
	const userInfo = decodeJwt(ctx.request)
	const status = ctx.query.status;
	if (status == 'processing') {
		const requests = await dbClient<RequestEntity>('request')
			.where('status', RequestStatus.PENDING)
			.where('assignedId', userInfo.id)
		return requests.map(r => {
			return {
				statement_key: r.statementId,

			}
		})
	}
	return []
}