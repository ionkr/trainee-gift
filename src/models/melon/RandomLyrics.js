class RandomLyrics extends require('./../NotifyObject') {
    constructor() {
        super();
        super.initialize('오늘의 노래는~?');
    }

    makeTitle() {
        return `${super._getToday()} ${this.name}`
    }

    async fetch() {
        await super.fetch();

        try {
            let index = randomInt(0, 99)
            let res = await request.get('https://m2.melon.com/cds/main/mobile4web/main_chartPaging.htm?startIndex=1&pageSize=100&rowsCnt=100', { mobile: true })
            let $ = await request.load(res.data);

            let result = $('body > li[class="list_item"]').find('div[class="content"] > div > a').map((idx, element) => {
                const regex = element.attribs.href.match(/(\d)/g)

                if (regex) {
                    return regex.join('')
                }
            }).get();

            const songId = result[index];

            if (!songId) return

            let detailRes = await request.get('https://m2.melon.com/song/lyrics.htm?songId=' + songId, { mobile: true })
            $ = await request.load(detailRes.data);

            const container = $('body > div[class="fixed_body"] > article[class="song_lyric"] > div[class="container"]')
            const heading = $(container).find('div[class="heading"] > h1').text().trim().split('-').map(e => e.trim()).join(' - ')

            let lyrics = '';

            $(container).find('div[class="lyrics"]').each((idx, root) => {
                for (const e of root.children) {
                    if (e.name === 'br') {
                        continue
                    }

                    lyrics += `${e.data.trim()}/`
                }
            })

            return `[#${index+1}] ${heading} / ${lyrics.slice(0, -2)}`
        } catch (e) {
            super.logError(e)
        }
    }
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

module.exports = new RandomLyrics();