import {Controller, Get, Header, Path, Route} from "tsoa";
import {Query} from "@tsoa/runtime/dist/decorators/parameter";
import {decodeAuthToken} from "../service/user/hash";
import {statementBook} from "../service/book/book";

@Route("/book")
export class BookController extends Controller {

    @Get("/:statementId")
    public async statementBook(
        @Query("dc") dc: number,
        @Query("dt") dt: number,
        @Path("statementId") statementId: number,
        @Header("authorization") jwt: string | undefined
    ): Promise<StatementBook> {
        const userInfo = decodeAuthToken(jwt)
        return statementBook(userInfo.id, dc, dt, statementId)
    }
}

export interface StatementBook {
    proposals: StatementBookItem[],
    requests: StatementBookItem[],
}

export interface StatementBookItem {
    cost: number,
    evalTime: number,
    ordersAmount: number,
    userOrdersAmount: number,
}