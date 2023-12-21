import Router from 'koa-router'
import {signup} from '../handler/user/sinup'
import {singin} from '../handler/user/signin'
import {balance} from '../handler/user/balance'
import {exists} from '../handler/user/exists'
import {pay} from '../handler/user/pay'
import {me} from '../handler/user/me'
import {bookTop} from '../handler/book/top'
import {healthcheck} from '../handler/healthcheck'
import {register} from '../handler/producer/register'
import {createRequest, getRequest, getRequestsFilter} from '../handler/request/request'
import {createStatement, getStatement, getStatements} from '../handler/statement/statement'
import {getProposals} from '../handler/proposal/proposal'
import {getProof, submitProof} from '../handler/proof/proof'

export const route = new Router()

route.get('/healthcheck', healthcheck)

route.post('/user/signup', signup)
route.post('/_open/signup', signup)
route.post('/user/signin', singin)
route.get('/user/balance', balance)
route.get('/user/me', me)
route.head('/user/exists/:login', exists)
route.get('/user/pay', pay)

route.get('/book/top', bookTop)

route.post('/producer', register)

route.get('/statement/:id', getStatement)
route.get('/statement', getStatements)
route.post('/statement', createStatement)

route.get('/request/filter', getRequestsFilter)
route.get('/request/:id', getRequest)
route.post('/request', createRequest)

route.get('/proposal', getProposals)

route.post('/proof', submitProof)
route.get('/proof', getProof)
