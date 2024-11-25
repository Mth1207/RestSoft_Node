import { createLogger, transports, format } from "winston";

const logger = createLogger({
    level: "debug",
    format: format.combine(
        format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        format.printf(({ level, message, timestamp}) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({
            filename: "logs/error.log",
            level: "error",
            format: format.combine(format.json()),
        }),
        new transports.File({
            filename: "logs/warn.log",
            level: "warn",
            format: format.combine(format.json()),
        }),
        new transports.File({
            filename: "logs/info.log",
            level: "info",
            format: format.combine(format.json()),
        }),
        new transports.File({
            filename: "logs/combine.log",
            format: format.combine(format.json()),
        }),
        new transports.Console({
            level: "debug",
            format: format.combine(
                format.colorize(),
                format.simple()
            ),
        }),
    ],
});

logger.exceptions.handle(
    new transports.File({filename: "logs/exceptions.log"})
);
logger.rejections.handle(
    new transports.File({filename: "logs/rejections.log"})
);


// // CONFIGURAÇÃO BÁSICA DE LOGS
// const logger = createLogger({
//     level: "info",
//     format: format.combine(
//         format.timestamp({
//             format: "YYYY-MM-DD HH:mm:ss",
//         }),
//         format.json()
//     ),
//     transports: [
//         new transports.File({ filename: "error.log", level: "error" }),
//         new transports.File({ filename: "combined.log" }),
//     ],
// });

export default logger;