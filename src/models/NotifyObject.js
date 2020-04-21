import moment from 'moment'

function chunkString (str, len) {
    const size = Math.ceil(str.length/len);
    const r = Array(size);
    let offset = 0;

    for (let i = 0; i < size; i++) {
        r[i] = str.substr(offset, len);
        offset += len
    }

    return r
}

class NotifyObject {
    constructor() {
        this.name = ''
    }

    initialize(name) {
        this.name = name
    }

    _getToday() {
        return moment().format(`YYYY년 MM월 DD일 HH:mm:ss`);
    }

    makeTitle() {
        return `[${this.name}] ${this._getToday()}`
    }

    async fetch() {
        logger.info(`[${this.name}] 새로운 데이터 가져오는 중 ...`)
    }

    logError(err) {
        logger.error(`[${this.name}] an error occurred: `, err)
    }

    async split(limit) {
        try {
            const res = await this.fetch();
            const splited = chunkString(res, limit)
            const title = this.makeTitle()

            return splited.map((msg, idx) => {
                return {
                    title: title + (splited.length > 1 ? ` - ${idx + 1}` : ''),
                    message: msg
                }
            })
        } catch (e) {
            this.logError(e);
        }

        return []
    }
}

module.exports = NotifyObject