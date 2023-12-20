import {dbClient} from './db/client'
import Koa from 'koa'
import {route} from './route/route'
import bodyParser from 'koa-bodyparser'
import {handleError} from './handler/error/error'
import yamljs from 'yamljs'
import {koaSwagger} from 'koa2-swagger-ui'
import {initRequestMatcher} from './service/request/matcher'

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
	const spec = yamljs.load('./openapi.yaml')
	return koaSwagger({ swaggerOptions: { spec }})
}

function initTasks() {
	initRequestMatcher()
}

function buildApp() {
	const app = new Koa()
	app.use(route.allowedMethods())
		.use(bodyParser())
		.use(handleError)
		.use(swaggerUi())
		.use(route.routes())
	return app
}

async function startApp() {
	await migrateDb()
	const app = buildApp()
	initTasks()

	app.listen(3000)
}

startApp()
	.then(() => {
		console.log('Started')
	})
