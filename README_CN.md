 [English](README.md) | [简体中文](README_CN.md)
## 使用说明

 制作一些小的工具类，目标是实现有价值的撸毛。计划会持续迭代更新更多小工具。

1.可批量生成钱包地址和私钥，并为每个地址绑定代理IP，可实现每个地址每次请求固定IP，避免产生波动；

2.每次执行脚本时，可实现随机获取钱包，打乱顺序执行，避免固定顺序被识别；

```
    root
    │  config.json
    │  start.js
    └─utils
        │  cipher.js
        │  generate.js
        │  logger.js
        │  utils.js
        │  walletList.csv
        ├─convert
        │      accountConvert.js
        │      originWallet.csv
        │      resultWallet.csv
        │      runConvert.js
        └─yesCaptcha
                yesCaptcha.js
```

#### 1、下载软件依赖库
`npm install`

## 免责声明
**交互程序不保存及上传任何私钥，使用前请确保电脑坏境安全，无任何扫盘木马软件及相应程序，本人不对任何钱包被盗事件做出负责及相应解释，使用该程序视为同意该声明。**

**使用前请自行检查代码**
**使用前请自行检查代码**
**使用前请自行检查代码**

**欢迎关注推特：https://twitter.com/BonusEggs**