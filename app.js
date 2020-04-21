global.logger = require('./src/utils/logger');
global.request = require('./src/utils/RequestPlugin');

process.env.ROLE = '/melon/MelonTop100, /melon/RandomLyrics, /news/Coinness';

let roles = []

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

    let messages = await Promise.all(roles.map(role => role.split(global.charLimit || 1500)))

    try {
        await Nonsan.welcome()
        await Nonsan.send(messages)
    } catch (e) {
       logger.error(e)
    }
})();

process.on("SIGINT", function () {
    logger.info('[APP] 서비스 종료')
    process.exit(0);
});