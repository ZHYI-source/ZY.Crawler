# zy-crawler

zy-crawler是一个基于Node.js的简单易用的爬虫工具，它可以用来获取网页中的数据。

## 安装

使用npm安装 zy-crawler:

```
npm install zy-crawler -s
```

## API文档

`(new Crawler(options)).fetch(url)`

- `url`：要爬取的网址

- `options`：一个可选的配置对象，包括以下属性：
    - `headers `：{} 目标网页的请求头
    - `timeout `：超时时间
    - `proxy `：代理地址

返回一个Promise，当爬取完成后，会将获取到的数据作为参数传递给`then`方法，并且返回一个对象，其中包含以下属性：

- `url`：已经爬取的网址
- `data`：获取到的数据

如果发生错误，则会将错误作为参数传递给`catch`方法。

## Node中使用示例

### 获取指定元素的内容

```

const Crawler = require('zy-crawler');

// 创建爬虫对象
const crawler = new Crawler({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
    timeout: 5000,
});

// 爬取单个网页
(async (req, res) => {
    try {
        const {url,data} = await crawler.fetch('https://www.58pic.com/c/25964047');
        const imgList = [];
        const $ = data
        $('img').each((index, element) => {
            // 对数据进行格式化 组建出符合自己要求的数据格式
            if (data(element).attr('class') === 'lazy') {
                const link = data(element).attr('data-original') && 'https:' + data(element).attr('data-original');
                const alt = data(element).attr('alt');
                const style = data(element).attr('sizes');
                link && imgList.push({alt, link, style});
            }
        });
        res.json({url,imgList})
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err)
    }
})();


// 爬取多个网页
(async () => {
  const urls = ['https://www.example.com', 'https://www.example.net'];
  const {urls,data} = await crawler.fetchAll(urls);
  for (let result of data) {
    console.log(result('title').text());
  }
})();

```

### 贡献

欢迎对zy-crawler进行贡献！如果你发现了任何问题或者有任何想法或建议，请通过以下方式联系我：

- 在Gitee 或者 GitHub上提出问题或请求。
- 提交一个Pull Request来改进代码。
- 通过电子邮件（[1840354092@qq.com](1840354092@qq.com)）与我们联系。

请注意，在提交Pull Request之前，请确保你的代码与我们的代码库保持同步，并且你的代码通过了我们的测试，并且符合我们的代码质量和风格要求。

### 许可证

zy-crawler是根据MIT许可证开源的。详情请参阅LICENSE文件。

### 鸣谢

我们感谢以下开源软件项目：

- Node.js
- Cheerio
- request-promise

