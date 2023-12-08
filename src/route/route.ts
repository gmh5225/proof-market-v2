import Router from 'koa-router';
import {signup} from "../handler/user/sinup";

export const route = new Router()

route.get('/', (ctx) => {
    ctx.body = 'Hello'
});

route.post('signup', signup)