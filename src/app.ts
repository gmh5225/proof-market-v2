import {dbClient} from "./db/client";
import Koa from "koa";
import {koaSwagger} from "koa2-swagger-ui";
import bodyParser from "koa-bodyparser";
import {handleError} from "./handler/error/error";
import KoaRouter from "@koa/router";
import {RegisterRoutes} from "./tsoa/routes";
import {initRequestMatcher} from "./service/matcher/book_matcher";
import {swaggerLocalPath} from './config/props'
import fs from "fs";

async function migrateDb() {
    try {
        await dbClient.migrate.latest()
        console.log('Database migrations are up to date')
    } catch (err) {
        console.error('Error running migrations', err)
        process.exit(1)
    }
}


function swaggerUi(): Koa.Middleware {
    const spec = JSON.parse(fs.readFileSync(swaggerLocalPath, 'utf8'))
    return koaSwagger({ swaggerOptions: { spec }})
}

function initTasks() {
    initRequestMatcher()
}

export function buildApp() {
    const app = new Koa()
    const route = new KoaRouter()
    RegisterRoutes(route)
    app.use(route.allowedMethods())
        .use(bodyParser())
        .use(handleError)
        .use(swaggerUi())
        .use(route.routes())
    return app
}

export async function startApp() {
    await migrateDb()
    const app = buildApp()
    initTasks()

    app.listen(80)
}