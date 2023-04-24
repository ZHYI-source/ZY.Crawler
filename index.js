const request = require('request-promise');
const cheerio = require('cheerio');

// 爬虫插件类
class Crawler {
    // 构造函数
    constructor(options = {}) {
        this.options = options;
    }

    // 爬取网页内容
    async fetch(url) {
        // 构造请求配置
        const requestOptions = {
            url: url,
            headers: this.options.headers || {},
            timeout: this.options.timeout || 5000,
            proxy: this.options.proxy || '',
            resolveWithFullResponse: true,
        };

        // 发送请求
        let response;
        try {
            response = await request(requestOptions);
        } catch (err) {
            throw new Error(`Failed to fetch page: ${url}. Error: ${err.message}`);
        }

        // 解析 HTML
        // 返回解析结果
        return cheerio.load({url, data: response.body});
    }

    // 爬取多个网页
    async fetchAll(urls) {
        const results = [];
        for (let url of urls) {
            try {
                const result = await this.fetch(url);
                results.push(result);
            } catch (err) {
                console.error(err.message);
            }
        }
        return {urls, data: results};
    }
}


module.exports = Crawler;
