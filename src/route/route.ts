import KoaRouter from "@koa/router"
import {signup} from '../handler/user/sinup'
import {singin} from '../handler/user/signin'
import {balance} from '../handler/user/balance'
import {exists} from '../handler/user/exists'
import {pay} from '../handler/user/pay'
import {me} from '../handler/user/me'
import {bookTop} from '../handler/book/top'
import {healthcheck} from '../handler/healthcheck'
import {registerProducerHandler} from '../handler/producer/register'
import {createRequestHandler, getRequestHandler, getRequestsFilterHandler} from '../handler/request/request'
import {createStatementHandler, getStatementHandler, getStatementsHandler} from '../handler/statement/statement'
import {createProposalsHandler, getProposalHandler, getProposalsHandler} from '../handler/proposal/proposal'
import {getProofHandler, submitProofHandler} from '../handler/proof/proof'
import {RegisterRoutes} from "../tsoa/routes";

export const route = new KoaRouter()
RegisterRoutes(route)

route.get('/healthcheck', healthcheck)

route.post('/user/signup', signup)
route.post('/user/signin', singin)
route.get('/user/balance', balance)
route.get('/user/me', me)
route.head('/user/exists/:login', exists)
route.get('/user/pay', pay)

route.get('/book/top', bookTop)

route.post('/producer', registerProducerHandler)

route.get('/statement/:id', getStatementHandler)
route.get('/statement', getStatementsHandler)
route.post('/statement', createStatementHandler)

route.get('/request', getRequestsFilterHandler)
route.get('/request/:id', getRequestHandler)
route.post('/request', createRequestHandler)

route.get('/proposal', getProposalsHandler)
route.get('/proposal/:id', getProposalHandler)
route.post('/proposal', createProposalsHandler)

route.post('/proof', submitProofHandler)
route.get('/proof/:id', getProofHandler)
