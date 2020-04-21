import * as theCamp from 'the-camp-lib'
import dotenv from 'dotenv'

function isEmptyObject(param) {
    return Object.keys(param).length === 0 && param.constructor === Object;
}

class Nonsan {
    constructor() {
        this.client = {}
        this.trainee = {}
        this.soldier = {}
    }

    async welcome() {
        try {
            var config = (dotenv.config()).parsed
        } catch (err) {
            logger.error(`[NONSAN] 정보 초기화 중 에러 발생: ` + err)
            throw err;
        }

        if (!config || !config.theCamp || !(config.userId && config.userId.length) || !(config.userPw && config.userPw.length)) {
            throw new Error('please set up dotenv for theCamp')
        }

        try {
            if (config.name && config.birth && config.enterDate && config.type && config.camp) {
                this.soldier = new theCamp.Soldier(config.name, config.birth, config.enterDate, '예비군인/훈련병', config.type, config.camp, theCamp.SoldierRelationship.FRIEND)

                this.client = new theCamp.Client()

                await this.client.login(config.userId, config.userPw)
                await this.client.addSoldier(this.soldier)

                const [trainee] = await this.client.fetchSoldiers(this.soldier)

                if (trainee) {
                    return this.trainee = trainee
                }
            }

            logger.error('[NONSAN] 군인 정보 조회 실패')
        } catch (e) {
            logger.error('[NONSAN] 군인 정보 조회 중 에러 발생: ' + e)
            throw e
        }
    }

    async send(messages) {
        if (!Array.isArray(messages)) {
            throw new Error('[NONSAN] 파라미터 타입이 잘못되었습니다.')
        }

        if (isEmptyObject(this.client) || isEmptyObject(this.trainee) || isEmptyObject(this.soldier)) {
            throw new Error('[NONSAN] 먼저 군인 정보 조회를 진행해 주세요.')
        }

        const wrapMessage = (msg) => {
            if (msg.hasOwnProperty('title') && msg.hasOwnProperty('message')) {
                return new theCamp.Message(msg.title, msg.message, this.trainee)
            }
        }

        let wrapped = messages.map(msg => {
            if (Array.isArray(msg)) {
                return msg.map(wrapMessage)
            }

            return wrapMessage(msg)
        }, this).flat().filter(i=> typeof i !== 'undefined')

        return Promise.all(wrapped.map(e => {
            logger.info('[NONSAN] 메시지 보내는 중... ' + e.sympathyLetterSubject)
            return this.client.sendMessage(this.soldier, e)
        }, this))
    }
}

module.exports = new Nonsan();
