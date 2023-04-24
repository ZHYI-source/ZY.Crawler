const request = require('request-promise');
const cheerio = require('cheerio');

class Crawler {
    constructor(options = {}) {
        this.options = options;
    }

    async fetch(url, formatFn = null) {
        const requestOptions = {
            url: url,
            headers: this.options.headers || {},
            timeout: this.options.timeout || 5000,
            proxy: this.options.proxy || '',
            resolveWithFullResponse: true,
        };

        let response;
        try {
            response = await request(requestOptions);
        } catch (err) {
            throw new Error(`网页获取失败: ${url}. Error: ${err.message}`);
        }

        const $ = cheerio.load(response.body);
        const data = formatFn ? formatFn($, response) : $;

        return {url, data};
    }

    async fetchAll(urls, formatFn = null) {
        const results = [];
        for (let url of urls) {
            try {
                const result = await this.fetch(url, formatFn);
                results.push(result);
            } catch (err) {
                throw new Error(`网页获取失败: ${url}. Error: ${err.message}`);
            }
        }
        return {url: urls, data: results};
    }
}


const crawler = new Crawler({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
    timeout: 5000,
    proxy: '',
});

(async () => {
    try {
        const result = await crawler.fetch('https://www.baidu.com', ($, response) => {
            const title = $('title').text();
            const statusCode = response.statusCode;
            return { title, statusCode };
        });
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();


module.exports = Crawler;


