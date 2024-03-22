import dotenv from 'dotenv'
dotenv.config()

import {setupTracing} from './instrumentation'
setupTracing('proof-market-v2')

import {startApp} from './app'

startApp()
	.then(() => {
		console.log('Started')
	})

process.on('uncaughtException', (err) => {
	console.error('Unhandled Exception', err)
	process.exit(1)
})
