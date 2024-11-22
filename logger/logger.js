const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// formato do log
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;    
});

const logger = createLogger({
    level: 'info', //nível mínimo
    format: combine(
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        colorize(), // aplicar cores aos diferentes níveis de log (info, warn, error, etc.)
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logger/logs_registers/info.log', level: 'info' }),
        new transports.File({ filename: 'logger/logs_registers/error.log', level: 'error' }),
        new transports.File({ filename: 'logger/logs_registers/warn.log', level: 'warn' })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logger/logs_registers/exceptions.log' })
    ]
});

module.exports = logger;