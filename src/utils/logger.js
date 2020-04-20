'use strict';

var winston = require('winston');
var moment = require('moment');

const tsFormat = function () {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};

//////////////////////////////////////////////////////////////////////////////////////////
const myFormat = winston.format.printf(info => {
    return tsFormat() + ' ' + info.message;
});

// Normal Logger: Winston
let logger = winston.createLogger({
    level: undefined,
    format: winston.format.combine(
        myFormat
    ),
    transports: [
        new(winston.transports.Console)({
            colorize: true,
            handleExceptions: true,
        }),

        new(require('winston-daily-rotate-file'))({
            filename: './logs/common.%DATE%.log',
            json: false
        }),
    ],
    exceptionHandlers: [
        new(require('winston-daily-rotate-file'))({
            filename: './logs/common-exception.%DATE%.log',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false
        }),
    ]
});

module.exports = logger;