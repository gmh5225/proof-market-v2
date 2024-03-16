import {Body, Controller, Header, Post, Route} from "tsoa";
import {decodeAuthToken} from "../service/user/hash";
import {registerOrUpdate} from "../service/producer/producer";
import {findById} from "../repository/user";
import {BadRequestError} from "../handler/error/error";
import {findByUserId, remove} from "../repository/producer";

@Route("/producer")
export class ProducerController extends Controller {

    @Post("/register")
    public async register(
        @Body() request: RegisterProducerRequest,
        @Header("authorization") jwt: string | undefined
    ): Promise<RegisterProducerResponse> {
        const userInfo = decodeAuthToken(jwt)
        const producerEntity = await registerOrUpdate(request, userInfo.id)
        return  {
            userId: userInfo.id,
            name : producerEntity.name,
            description: producerEntity.description,
            url: producerEntity.url,
            ethAddress: producerEntity.eth_address,
        }
    }

    @Post("/deregister")
    public async deregister(
        @Header("authorization") jwt: string | undefined
    ): Promise<boolean> {
        const userInfo = decodeAuthToken(jwt)
        const user = await findById(userInfo.id)
        if (!user) {
            throw new BadRequestError('User not found')
        }
        const producer = await findByUserId(userInfo.id)
        if (!producer) {
            return false
        }
        await remove(producer!.id!)
        return true
    }
}

export interface RegisterProducerRequest {
    name: string,
    description: string,
    url: string,
    ethAddress: string,
}

export interface RegisterProducerResponse {
    userId: number,
    name : string,
    description: string,
    url: string,
    ethAddress: string,
}
