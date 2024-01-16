import {Body, Controller, Get, Header, Path, Post, Route} from "tsoa";
import {CreateProposalRequest, ProposalFilter, ProposalItem} from "../handler/proposal/proposal";
import {decodeAuthToken} from "../service/user/hash";
import {createProposal, getProposals} from "../service/proposal/proposal";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";
import {RequestStatus} from "../repository/request";

@Route("/proposal")
export class ProposalController extends Controller {

    @Get("/:id")
    public async getById(
        @Path("id") id: number,
        @Header("authorization") jwt: string | undefined
    ): Promise<ProposalItem> {
        const userInfo = decodeAuthToken(jwt)
        const filter = {
            id: id,
        } as ProposalFilter
        console.log(`User ${userInfo.id}: get proposals by id ${id}`)
        return (await getProposals(userInfo.id, filter))[0]
    }

    @Get()
    public async getByFilter(
        @Query("status") status: RequestStatus,
        @Header("authorization") jwt: string | undefined,
    ): Promise<ProposalItem[]> {
        const userInfo = decodeAuthToken(jwt)
        const filter = {
            id: undefined,
            status: status
        } as ProposalFilter
        console.log(`User ${userInfo.id}: get proposals by filter ${JSON.stringify(filter)}`)
        return await getProposals(userInfo.id, filter);
    }

    @Post()
    public async createProposal(
        @Body() request: CreateProposalRequest,
        @Header("authorization") jwt: string | undefined,
    ): Promise<ProposalItem> {
        const userInfo = decodeAuthToken(jwt)
        console.log(`User ${userInfo.id}: create proposal - ${JSON.stringify(request)}`)
        return await createProposal(userInfo.id, request)
    }
}
