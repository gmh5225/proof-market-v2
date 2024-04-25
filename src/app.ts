import {dbClient} from './db/client'
import Koa from 'koa'
import {koaSwagger} from 'koa2-swagger-ui'
import bodyParser from 'koa-bodyparser'
import {handleError} from './handler/error/error'
import KoaRouter from '@koa/router'
import {RegisterRoutes} from './tsoa/routes'
import {initRequestMatcher} from './service/matcher/book_matcher'
import {swaggerLocalPath} from './config/props'
import fs from 'fs'
import cors from '@koa/cors'
import logger from './logger'

async function migrateDb() {
	try {
		await dbClient.migrate.latest()
		logger.info('Database migrations are up to date')
	} catch (err) {
		logger.error('Error running migrations', err)
		process.exit(1)
	}
}


function swaggerUi(): Koa.Middleware {
	const spec = JSON.parse(fs.readFileSync(swaggerLocalPath, 'utf8'))
	return koaSwagger({swaggerOptions: {spec}})
}

function initTasks() {
	initRequestMatcher()
}

async function requestLogger(ctx: Koa.Context, next: Koa.Next) {
	const start = Date.now()
	await next()
	const ms = Date.now() - start
	logger.debug(`${ctx.method} ${ctx.url} - ${ms}ms`)
}

export function buildApp() {
	const app = new Koa()
	const route = new KoaRouter()
	RegisterRoutes(route)
	app.use(cors({
		origin: '*', // Allows requests from any origin
		// TODO: Restrict allowed origins for better security in production
	}))
		.use(route.allowedMethods())
		.use(bodyParser())
		.use(handleError)
		.use(swaggerUi())
		.use(requestLogger)
		.use(route.routes())
	return app
}

export async function startApp(): Promise<Koa> {
	await migrateDb()
	const app = buildApp()
	initTasks()

	app.listen(80)
	return app
}