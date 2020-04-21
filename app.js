import moment from 'moment'
require('moment-timezone')

moment.tz.setDefault('Asia/Seoul')

global.logger = require('./src/utils/logger');
global.request = require('./src/utils/RequestPlugin');

if (!process.env.ROLE) {
    process.env.ROLE = '/melon/MelonTop100, /melon/RandomLyrics, /news/Coinness';
}

if (!process.env.RUNNING_HOURS) {
    process.env.RUNNING_HOURS = '10, 16'
}

let roles = []
let runningHours = []

const parseRole = (role) => {
    if (role.startsWith('/news')) {
        return ['/news', role.split('/news/')[1]]
    }

    return [role, false]
}

const sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

import Nonsan from './src/nonsan'

(async () => {
    logger.info('[APP] 서비스 시작')

    for (let role of (process.env.ROLE || '').split(',')) {
        role = parseRole(role.trim());

        const obj = require('./src/models' + role[0])
        roles.push(role[1] ? obj[role[1]] : obj)
    }

    try {
        let hours = process.env.RUNNING_HOURS.split(',');
        runningHours = hours.map(i => Number(i.trim()));
    } catch (e) {
        logger.error('invalid running hours!' + e)
        process.exit(1)
    }

    try {
        await Nonsan.welcome()
    } catch (e) {
       logger.error(e)
        process.exit(1)
    }

    while(1) {
        if (runningHours.includes(moment().hours())) {
            let messages = await Promise.all(roles.map(role => role.split(global.charLimit || 1500)))
            await Nonsan.send(messages)
        }

        await sleep(1000 * 60 * 60)
    }
})();

process.on("SIGINT", function () {
    logger.info('[APP] 서비스 종료')
    process.exit(0);
});