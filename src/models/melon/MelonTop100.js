class MelonTop100 extends require('./../NotifyObject') {
    constructor() {
        super();
        super.initialize('멜론차트 탑100');
    }

    async fetch() {
        await super.fetch();

        try {
            let res = await request.get('https://m2.melon.com/cds/main/mobile4web/main_chartPaging.htm?startIndex=1&pageSize=100&rowsCnt=100', { mobile: true })
            let $ = await request.load(res.data);

            let result = $('body > li[class="list_item"]').find('div[class="content"] > div > a').map((idx, element) => {
                const title = $(element).find('p').text().trim();
                const artist = $(element).find('span').text().trim();

                if (title && artist) {
                    return `#${idx + 1} ${title} - ${artist}`
                }
            }).get().join(' / ');

            return result
        } catch (e) {
            super.logError(e)
        }
    }
}

module.exports = new MelonTop100();