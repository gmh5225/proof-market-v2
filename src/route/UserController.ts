import {Body, Controller, Get, Header, Post, Route} from "tsoa";
import {authUser, AuthUser, userDetails, UserDetails} from "../service/user/user";
import {decodeAuthToken} from "../service/user/hash";
import * as crypto from "crypto";
import {hashMessage, recoverAddress} from "ethers";

@Route("/user")
export class UserController extends Controller {

    @Get("/metamask/message")
    public async metamaskAuthMessage(): Promise<MetamaskAuthMessage> {
        const nonce = crypto.randomBytes(16).toString('hex')
        const expiration = new Date(new Date().getTime() + (60*60*1000))
        const msg = `proof_market_${nonce}_${expiration}`
        return {
            msg: msg,
            expiration: expiration,
        }
    }

    @Post("/metamask")
    public async metamaskAuth(
        @Body() request: MetamaskAuthRequest,
    ): Promise<AuthUser> {
        const hash = hashMessage(request.msg)
        const address = recoverAddress(hash, request.signature);
        return await authUser(address)
    }

    @Get("/info")
    public async me(
        @Header("Authorization") jwt: string | undefined,
    ): Promise<UserDetails> {
        return userDetails(decodeAuthToken(jwt).id)
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

export interface MetamaskAuthRequest {
    msg: string,
    signature: string,
}

export interface MetamaskAuthMessage {
    msg: string,
    expiration: Date,
}
