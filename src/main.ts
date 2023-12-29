import {startApp} from "./app";

startApp()
	.then(() => {
		console.log('Started')
	})

process.on('uncaughtException', (err) => {
	console.error('Unhandled Exception', err)
	process.exit(1)
})
