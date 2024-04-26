import winston from 'winston'
import {logInFile, logLevel} from './config/props'
import DailyRotateFile from "winston-daily-rotate-file";

// Define custom colors for different log levels
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
})

// Create the logger instance
const logger = winston.createLogger({
    level: logLevel, // Use the log level from your configuration
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.colorize({
            all: true, // Colorize the entire message
        }),
        winston.format.printf(({level, message, timestamp}) => {
            // TODO: There is a way to add dd trace in the log if we need, not sure how but know it exists
            return `${timestamp} ${level}: ${message}`
        }),
    ),
    transports: [
        new winston.transports.Console(),
    ],
})

if (logInFile) {
    logger.add(new DailyRotateFile({
        level: 'info',
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '100m',
        maxFiles: '14d'
    }))
}

export default logger;
