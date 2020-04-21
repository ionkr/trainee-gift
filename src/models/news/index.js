let newsMap = {
    DaumAll: {
        name: '다음뉴스 종합',
        xml: 'http://media.daum.net/rss/today/primary/all/rss2.xml'
    },
    DaumEnt: {
        name: '다음뉴스 연예',
        xml: 'http://media.daum.net/rss/today/primary/entertain/rss2.xml'
    },
    DaumSports: {
        name: '다음뉴스 스포',
        xml: 'http://media.daum.net/rss/today/primary/sports/rss2.xml'
    },
    Coinness: {
        name: '코인니스',
        xml: 'https://kr.coinness.com/newsflash.rss'
    }
}

import NewsFeed from './NewsFeed'

for (const [key, info] of Object.entries(newsMap)) {
    exports[key] = new NewsFeed(info.name, info.xml)
}