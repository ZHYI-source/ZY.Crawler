# Zy.Crawler

Zy.Crawler是一个基于Node.js的简单易用的爬虫工具，它可以用来获取网页中的数据并将其保存到本地或者数据库中。

## 安装

使用npm安装Zy.Crawler:

```
Copy code
npm install zy-crawler
```

## 使用

在你的Node.js项目中，你可以使用以下代码来使用Zy.Crawler：

```
javascriptCopy codeconst zyCrawler = require('zy-crawler');

zyCrawler.crawl('https://example.com')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

这个例子展示了如何获取一个网站的HTML内容。你也可以使用其他的方法，例如获取一个特定元素的内容，或者将数据保存到一个文件或者数据库中。

## API文档

### `crawl(url, options)`

- `url`：要爬取的网址

- `options`：一个可选的配置对象，包括以下属性：


  - `selector`：一个CSS选择器，用来指定要获取的元素的位置
  - `format`：一个函数，用来将获取到的数据格式化成指定的格式

返回一个Promise，当爬取完成后，会将获取到的数据作为参数传递给`then`方法，并且返回一个对象，其中包含以下属性：

- `url`：已经爬取的网址
- `data`：获取到的数据

如果发生错误，则会将错误作为参数传递给`catch`方法。

## 示例

### 获取指定元素的内容

```
javascriptCopy codezyCrawler.crawl('https://example.com', {
  selector: '#content',
  format: data => data.trim()
})
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

### 将数据保存到文件中

```
javascriptCopy codeconst fs = require('fs');

zyCrawler.crawl('https://example.com', {
  format: data => {
    fs.writeFileSync('data.txt', data);
  }
})
  .then(() => {
    console.log('数据已保存到文件中');
  })
  .catch(error => {
    console.error(error);
  });
```

### 将数据保存到MongoDB中

```
javascriptCopy codeconst MongoClient = require('mongodb').MongoClient;

zyCrawler.crawl('https://example.com', {
  format: data => {
    MongoClient.connect('mongodb://localhost:27017/', (error, client) => {
      if (error) {
        throw error;
      }

      const db = client.db('example');
      const collection = db.collection('data');

      collection.insertOne({data: data}, (error, result) => {
        if (error) {
          throw error;
        }

        console.log('数据已保存到数据库中');
        client.close();
      });
    });
  }
})
  .then(() => {
    console.log('数据已保存到数据库中');
  })
  .catch(error => {
    console.error(error);
  });
```

### 贡献

欢迎对Zy.Crawler进行贡献！如果你发现了任何问题或者有任何想法或建议，请通过以下方式联系我们：

- 在GitHub上提出问题或请求。
- 提交一个Pull Request来改进代码。
- 通过电子邮件（[yourname@example.com](mailto:yourname@example.com)）与我们联系。

请注意，在提交Pull Request之前，请确保你的代码与我们的代码库保持同步，并且你的代码通过了我们的测试，并且符合我们的代码质量和风格要求。

### 许可证

Zy.Crawler是根据MIT许可证开源的。详情请参阅LICENSE文件。

### 鸣谢

我们感谢以下开源软件项目：

- Node.js
- Cheerio
- Request

这些项目提供了我们需要的工具和库，使得Zy.Crawler的开发和维护变得更加容易。