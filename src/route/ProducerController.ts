import {Body, Controller, Header, Post, Route} from "tsoa";
import {RegisterProducerRequest} from "../handler/producer/register";
import {decodeAuthToken, decodeJwt} from "../service/user/hash";
import {registerOrUpdate} from "../service/producer/producer";

@Route("/user")
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
            ethAddress: producerEntity.ethAddress,
        }
    }
}

export interface RegisterProducerResponse {
    userId: number,
    name : string,
    description: string,
    url: string,
    ethAddress: string,
}