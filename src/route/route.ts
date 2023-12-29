import Router from 'koa-router'
import {signup} from '../handler/user/sinup'
import {singin} from '../handler/user/signin'
import {balance} from '../handler/user/balance'
import {exists} from '../handler/user/exists'
import {pay} from '../handler/user/pay'
import {me} from '../handler/user/me'
import {bookTop} from '../handler/book/top'
import {healthcheck} from '../handler/healthcheck'
import {registerHandler} from '../handler/producer/register'
import {createRequestHandler, getRequestHandler, getRequestsFilterHandler} from '../handler/request/request'
import {createStatementHandler, getStatementHandler, getStatementsHandler} from '../handler/statement/statement'
import {createProposalsHandler, getProposalsHandler} from '../handler/proposal/proposal'
import {getProofHandler, submitProofHandler} from '../handler/proof/proof'

export const route = new Router()

route.get('/healthcheck', healthcheck)

route.post('/user/signup', signup)
route.post('/_open/signup', signup)
route.post('/user/signin', singin)
route.get('/user/balance', balance)
route.get('/user/me', me)
route.head('/user/exists/:login', exists)
route.get('/user/pay', pay) // V2

route.get('/book/top', bookTop) // V2

route.post('/producer', registerHandler)

route.get('/statement/:id', getStatementHandler)
route.get('/statement', getStatementsHandler)
route.post('/statement', createStatementHandler)

route.get('/request/filter', getRequestsFilterHandler)
route.get('/request/:id', getRequestHandler)
route.post('/request', createRequestHandler)

route.get('/proposal', getProposalsHandler)
route.get('/proposal/:id', getProposalsHandler)
route.post('/proposal', createProposalsHandler)

route.post('/proof', submitProofHandler)
route.get('/proof/:id', getProofHandler)
