 [English](README.md) | [简体中文](README_CN.md)
## Instructions for use

Create some small tools with the goal of achieving valuable grooming. The plan will continue to iterate and update more small tools.

1. It can generate wallet addresses and private keys in bulk, and bind proxy IPs for each address, enabling each address to request a fixed IP address each time, avoiding fluctuations;

2. Each time the script is executed, it can randomly obtain the wallet, shuffle the order of execution, and avoid fixed order being recognized;

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

#### 1.install dependency libraries
`npm install`

## Disclaimers

**The interactive program does not save or upload any private keys. Before use, please ensure that the computer environment is safe and there are no scanning Trojan software or corresponding programs. I am not responsible for any wallet theft incidents and will not provide corresponding explanations. Using this program is deemed to agree to this statement**



**Please check the code yourself before use**

**Please check the code yourself before use**

**Please check the code yourself before use**



**Welcome to follow Twitter: https://twitter.com/BonusEggs**