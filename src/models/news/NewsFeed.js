import rssParser from 'rss-parser'

class NewsFeed extends require('./../NotifyObject') {
    constructor(name, xml) {
        super();
        super.initialize(name);
        this.parser = new rssParser();
        this.xml = xml;
    }

    async fetch() {
        await super.fetch();

        try {
            const feed = await this.parser.parseURL(this.xml)

            if (feed && feed.items && feed.items.length > 1) {
                return this.format(feed.items)
            }
        } catch (e) {
            super.logError(e)
        }

        return ''
    }

    format(items) {
        const converter = (text = '') => {
            return text.replace(/&quot;/g, '\"')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace('\n<p>', '')
                .replace('<p></p>', '')
                .replace('<p>&#160;', '')
                .replace('&#160; ', '');
        };

        return items.map(item => {
            const title = converter(item.title);
            let content = converter(item.content);

            if (content.startsWith('(끝)본 기사는 인포맥스 금융정보 단말기에서 2시간 더 빠른')) {
                content = '';
            } else {
                content = content.slice(0, content.indexOf('다.') + 1);
                content = content.replace(/^(\*그림\d\*)?(\(|\[|【)\s?.*=.*\s?(\)|\]|】)\s?/, '')
                    .replace(/^[가-힣]{2,3}\s(기자|특파원)\s=\s/, '');
                content += ' / ';
            }

            return `#${title}/\n${content}`;
        }).join('')
    }
}

module.exports = NewsFeed