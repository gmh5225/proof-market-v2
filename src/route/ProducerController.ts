import {Body, Controller, Get, Header, Post, Route} from "tsoa";
import {RegisterProducerRequest} from "../handler/producer/register";
import {decodeAuthToken, decodeJwt} from "../service/user/hash";
import {registerOrUpdate} from "../service/producer/producer";
import {dbClient} from "../db/client";
import {StatementEntity} from "../repository/statement";

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

    @Get("/last")
    public async last(): Promise<LastStatementInfo[]>  {
        // TODO: unclear business logic, from v1
        const statements = await dbClient<StatementEntity>('statement')
            .orderBy('created_at', 'DESC');
        return statements.map(s => {
            return {
                id: s.id!,
                senderId: s.sender_id,
            }
        })
    }
}

export interface RegisterProducerResponse {
    userId: number,
    name : string,
    description: string,
    url: string,
    ethAddress: string,
}

export interface LastStatementInfo {
    id: number,
    senderId: number,
}