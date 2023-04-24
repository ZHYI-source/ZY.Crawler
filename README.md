# zy-crawler

zy-crawler是一个基于Node.js的简单易用的爬虫工具，可以方便地获取指定网页的内容并进行自定义格式化处理。

## 安装

使用npm安装 zy-crawler:

```
npm install zy-crawler -s
```

## API文档

`Crawler(options)`
构造函数，创建一个新的爬虫实例。

- `options`：<Object> 可选参数：
    - `headers `：<Object> HTTP 请求头，默认为空对象
    - `timeout `：<Number> 请求超时时间（毫秒），默认为 5000
    - `proxy `：<String> 代理服务器地址，例如 `http://127.0.0.1:8080`，默认为空字符串 示例代码：

```js
// 创建爬虫实例
const crawler = new Crawler({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
    timeout: 5000,
    proxy: '',
});



```

`crawler.fetch(url)`
爬取指定单个网页的内容，并返回解析后的数据。

- `url`：<String> 网页地址 返回值 <Promise> Promise 对象，解析后的数据包括：
    - `url`：<String> 网页地址
    - `data`： <Object> Cheerio 实例，解析后的 DOM 对象

示例代码：

```js
// 爬取单个网页
(async () => {
  try {
    const {url, data} = await crawler.fetch('https://www.jianshu.com/');
    const $ = data;
    const result = {};
    // 获取文章列表
    const articleList = [];
    $('.content').each((i, el) => {
      const $el = $(el);
      const article = {};
      article.title = $el.find('.title').text();
      article.abstract = $el.find('.abstract').text();
      articleList.push(article);
    });
    result.articleList = articleList;
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();

// 成功响应：
{
  articleList: [
    {
      title: '留白阅读408|《低风险创业》拥有更多秘密，是企业的护城河',
      abstract: '\n' +
              '      2023.02.01 大同 星期三 多云（-3℃/-18℃） （简书日更148天/总日更834天） 作为一个企业，能够把某一项的服务做到极致，变...\n' +
              '    '
    },
    {
      title: '植物和它们的孩子',
      abstract: '\n' +
              '      文/肚子 近来女儿有事，茉莉的芭蕾舞学习，便由我和先生作陪。 于珠海大剧院艺术中心学各种特长的孩子们都有家长陪伴，有的几位家长前呼后拥，孩子俨然...\n' +
              '    '
    }
  ]
}
```

`crawler.fetchAll(urls)`
爬取多个网页的内容，并返回解析后的数据。

- `urls`：<Array> 网页地址数组 返回值 <Promise> Promise 对象，解析后的数据包括：
    - `url`： <Array> 网页地址数组
    - `data`：<Array> 包含解析后的数据的数组，每个元素格式同 fetch 方法的返回值

示例代码：

```js
// 爬取多个网页
(async () => {
  try {
    const {url, data} = await crawler.fetchAll([
      'https://juejin.cn/',
      'https://www.jianshu.com/',
    ]);
    const result = {};
    const articleList = [];
    for (const resultElement of data) {
      const $ = resultElement.data;
      if (resultElement.url === 'https://juejin.cn/') {
        $('.item').each((i, el) => {
          console.log($(el))
          const $el = $(el);
          const article = {};
          article.title = $el.find('.title').text();
          article.abstract = $el.find('.description').text();
          articleList.push(article);
        });
      } else {
        $('.content').each((i, el) => {
          const $el = $(el);
          const article = {};
          article.title = $el.find('.title').text();
          article.abstract = $el.find('.abstract').text();
          articleList.push(article);
        });
      }
    }
    result.articleList = articleList;
    console.log(result);

  } catch (err) {
    console.error(err);
  }
})();
```

`自定义格式化处理 format `

`crawler.fetch(url,format)`

使用示例：
```js
// 爬取网页并进行数据格式化
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
```


### 完整示例

```js
const Crawler = require('zy-crawler');

// 创建爬虫实例
const crawler = new Crawler({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
    timeout: 5000,
    proxy: '',
});

// 爬取单个网页
(async () => {
    try {
        const result = await crawler.fetch('https://www.example.com');
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();

// 爬取多个网页
(async () => {
    try {
        const result = await crawler.fetchAll([
            'https://www.example.com/page1',
            'https://www.example.com/page2',
            'https://www.example.com/page3',
        ]);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();


```

#### 自定义格式化处理

默认情况下，本插件会返回 cheerio 对象，即可以直接进行 jQuery 风格的 DOM 操作。

如果需要对返回结果进行自定义格式化处理，可以在调用 fetch 或 fetchAll 方法时传入一个格式化函数，例如：

```js
const Crawler = require('zy-crawler');

const crawler = new Crawler();

// 定义格式化函数
const format = ($, response) => {
    const title = $('title').text();
    const content = $('#content').text();
    const url = response.request.href;

    return {title, content, url};
};

// 爬取单个网页并进行格式化处理
(async () => {
    try {
        const result = await crawler.fetch('https://www.example.com', format);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();

// 爬取多个网页并进行格式化处理
(async () => {
    try {
        const result = await crawler.fetchAll([
            'https://www.example.com/page1',
            'https://www.example.com/page2',
            'https://www.example.com/page3',
        ], format);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();

```

### 贡献

欢迎对zy-crawler进行贡献！如果你发现了任何问题或者有任何想法或建议，请通过以下方式联系我：

- 在[Gitee](https://gitee.com/Z568_568/ZY.Crawler.git) 上提出问题或请求。
- 提交一个Pull Request来改进代码。
- 通过电子邮件（[1840354092@qq.com](1840354092@qq.com)）联系。

请注意，在提交Pull Request之前，请确保你的代码与我们的代码库保持同步，并且你的代码通过了我们的测试，并且符合我们的代码质量和风格要求。

### 许可证

zy-crawler是根据MIT许可证开源的。详情请参阅LICENSE文件。

### 鸣谢

我们感谢以下开源软件项目：

- Node.js
- Cheerio
- request-promise

