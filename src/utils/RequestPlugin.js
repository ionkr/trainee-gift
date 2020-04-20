import axios from 'axios'
import cheerio from 'cheerio'

class RequestPlugin {
    constructor() {
        this.defaultHeaders = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
        }
    }

    async get(url, params = {}) {
        if (params.mobile) {
            params.headers = Object.assign(params.headers || {}, this.defaultHeaders)
        }

        return axios.get(url, params)
    }

    async post(url, params = {}) {
        if (params.mobile) {
            params.headers = Object.assign(params.headers || {}, this.defaultHeaders)
        }

        return axios.post(url, params)
    }

    async load(res) {
        return cheerio.load(res)
    }
}

module.exports = new RequestPlugin();