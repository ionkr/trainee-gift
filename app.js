// configure parameters
// http://emart.ssg.com/item/itemView.ssg?itemId=1000035476219&ckwhere=linkprice
// process.argv.forEach((val, idx, arr) => {
//     global.charLimit = val;
// })

global.logger = require('./src/utils/logger');
global.request = require('./src/utils/RequestPlugin');

process.env.ROLE = '/melon/MelonTop100, /melon/RandomLyrics';

let roles = []

const sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

(async () => {
    logger.info('[APP] 서비스 시작')

    for (let role of (process.env.ROLE || '').split(',')) {
        role = role.trim();

        roles.push(require('./src/models' + role))
    }

    for (const role of roles) {
        console.log(await role.split(global.charLimit || 1500))
    }
})();

process.on("SIGINT", function () {
    logger.info('[APP] 서비스 종료')
    process.exit(0);
});