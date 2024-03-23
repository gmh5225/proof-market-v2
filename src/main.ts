import dotenv from 'dotenv'

dotenv.config()

import logger from './logger'

import {setupTracing} from './instrumentation'

setupTracing('proof-market-v2')

import {startApp} from './app'

startApp()
	.then(() => {
		logger.info('Started')
	})

process.on('uncaughtException', (err) => {
	logger.error('Unhandled Exception', err)
	process.exit(1)
})
