import Router from 'koa-router'
import {signup} from '../handler/user/sinup'
import {singin} from '../handler/user/signin'
import {balance} from "../handler/user/balance";
import {exists} from "../handler/user/exists";
import {pay} from "../handler/user/pay";
import {me} from "../handler/user/me";
import {bookTop} from "../handler/book/top";
import {healthcheck} from "../handler/healthcheck";
import {register} from "../handler/producer/register";

export const route = new Router()

route.get('/healthcheck', healthcheck)

route.post('/user/signup', signup)
route.post('/user/signin', singin)
route.get('/user/balance', balance)
route.get('/user/me', me)
route.head('/user/exists/:login', exists)
route.get('/user/pay', pay)

route.get('/book/top', bookTop)

route.post('/producer', register)
