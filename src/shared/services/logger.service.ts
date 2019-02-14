import * as moment from "moment";
import { Service } from "typedi";
import appConfig from "../../config";
var packageJson = require("../../../package.json");
var winston = require('winston');
require("winston-mongodb");
require('winston-daily-rotate-file');

/**
 * Logger Service
 */
@Service()
export class LoggerService {

    logger: any;

    timestampFormatter = () => {
        return moment().format('YYYY-MM-DD HH:MM:ss.SSS');
    };

    transportConsole = new winston.transports.Console({
        json: true,
        level: 'debug',
        timestamp: this.timestampFormatter
    });
    debugTransportDailyFile = new winston.transports.DailyRotateFile({
        json: true,
        level: "debug",
        dirname: appConfig.loggerFile.filePath,
        filename: `${packageJson.name}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: appConfig.loggerFile.maxSize,
        maxFiles: appConfig.loggerFile.maxFiles,
        timestamp: this.timestampFormatter
    });
    errorTransportDailyFile = new winston.transports.DailyRotateFile({
        json: true,
        level: "error",
        dirname: appConfig.loggerFile.filePath,
        filename: `${packageJson.name}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: appConfig.loggerFile.maxSize,
        maxFiles: appConfig.loggerFile.maxFiles,
        timestamp: this.timestampFormatter
    });
    transportMongoDB = new winston.transports.MongoDB({
        level: "error",
        db: appConfig.mongoUrl,
        collection: 'logs',
        capped: true
    })

    constructor() {
        //Test environment logger configuration
        winston.loggers.add('test', {
            transports: [this.transportConsole, this.debugTransportDailyFile]
        });
        //Production environment logger configuration
        winston.loggers.add('prod', {
            transports: [this.errorTransportDailyFile, this.transportMongoDB]
        });

        console.log(" ENV: " + process.env.NODE_ENV);
        if (process.env.NODE_ENV == 'prod') {
            this.logger = winston.loggers.get('prod');
        }
        else {
            this.logger = winston.loggers.get('test');
        }
    }

    /**
     * 输出info
     * @param message 
     * @param meta 
     */
    info(message: string, meta?: any) {
        this.logger.info(message, meta);
    }

    /**
     * 输出debug
     * @param message 
     * @param meta 
     */
    debug(message: string, meta?: any) {
        this.logger.debug(message, meta);
    }

    /**
     * 输出error
     * @param message 
     * @param meta 
     */
    error(message: string, meta?: any) {
        this.logger.error(message, meta);
    }

    /**
     * 输出warning
     * @param message 
     * @param meta 
     */
    warn(message: string, meta?: any) {
        this.logger.warn(message, meta);
    }
}