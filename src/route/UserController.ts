import {Body, Controller, Get, Header, Path, Post, Route} from "tsoa";
import {AuthUser, createUser, login, userDetails, UserDetails} from "../service/user/user";
import {userBalanceInfo, UserBalanceInfo} from "../service/user/balance";
import {decodeAuthToken} from "../service/user/hash";
import {existsByLogin} from "../repository/user";
import {NotFoundError} from "../handler/error/error";
import {createPayTransaction, TransactionInfo} from "../service/transaction/transaction";

@Route("/user")
export class UserController extends Controller {

    @Post("/signup")
    public async signup(
        @Body() request: SignupRequest,
    ): Promise<AuthUser> {
        const userEntity = await createUser(request);
        return  await login({
            username: userEntity.login,
            password: request.passwd,
        })
    }

    @Post("/signin")
    public async signin(
        @Body() request: SigninRequest,
    ): Promise<AuthUser> {
        return await login(request)
    }

    @Get("/balance")
    public async balance(
        @Header("authorization") jwt: string | undefined,
    ): Promise<UserBalanceInfo> {
        return userBalanceInfo(decodeAuthToken(jwt).id)
    }

    @Get("/me")
    public async me(
        @Header("authorization") jwt: string | undefined,
    ): Promise<UserDetails> {
        return userDetails(decodeAuthToken(jwt).id)
    }

    @Get("/exists/:login")
    public async exists(
        @Path("login") login: string
    ): Promise<void> {
        const userInfo = await existsByLogin(login)
        if (!userInfo) {
            throw new NotFoundError("User not found")
        }
    }

    @Post("/pay")
    public async pay(
        @Body() request: PayRequest,
        @Header("authorization") jwt: string | undefined,
    ): Promise<TransactionInfo> {
        const userInfo = decodeAuthToken(jwt)
        return createPayTransaction(request, userInfo.id)
    }

}

export interface SignupRequest {
    user: string
    passwd: string
    email?: string
}

export interface SigninRequest {
    username: string
    password: string
}

export interface PayRequest {
    sender: number,
    receiver: number,
    amount: number,
}