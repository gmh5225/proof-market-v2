import Router from 'koa-router'
import {signup} from '../handler/user/sinup'
import {singin} from '../handler/user/signin'
import {balance} from "../handler/user/balance";
import {exists} from "../handler/user/exists";

export const route = new Router()

route.post('/user/signup', signup)
route.post('/user/signin', singin)
route.get('/user/balance', balance)
route.head('/user/exists/:login', exists)