const axios = require('axios');
const fs = require('fs');
const csvParser = require('csv-parser');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { v4: uuidv4 } = require('uuid');

const Cipher = require('./cipher');

const config = require('../config/runner.json');

class Utils{
    constructor(waitMinSec, waitMaxSec, waitFactor){
        Object.keys(config).forEach((key)=>{
            this[key] = config[key];
        });
        if(waitMinSec){
            this.minInterval = waitMinSec;
        }
        if(waitMaxSec){
            this.maxInterval = waitMaxSec;
        }
        if(waitFactor){
            this.randomFactor = waitFactor;
        }
    }
    
    sleep = (seconds) => {
        const milliseconds = seconds * 1000;
        return new Promise(resolve => setTimeout(resolve, milliseconds));
      };

    //读取csv文件,根据输入key对wallet解密
    /**
     * 读取帐户信息，多帐户情况下，可以实现随机顺序选择帐户执行callback回调函数
     * @param {String} filePath 读取帐户CSV文件路径
     * @param {Function} callback 回调函数必须有JSON参数，参数形式如：
     * {
     *  address: '0x0000',
     *  privateKey: '00000:',
     *  proxy: 'http://0000:0000@1.0.0.0:00'
     *  }
     */
    async processAccounts(filePath, callback) {
        if (typeof callback !== 'function') {
            throw Error(`参数 callback 必须是一个函数`);
        }
        let accounts = [];
        let secretKey = Cipher.getKeyFromUser();
        //async 生效需要返回Promise对象
        return new Promise((resolve,reject)=>{
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    let decryptedPrivateKey = Cipher.decrypt(row.privateKey, secretKey);
                    //为每行数据添加随机ID
                    let uid = uuidv4();
                    //将uid和row组装到结果中
                    accounts[uid] = { ...row, decryptedPrivateKey };
                })
                .on('end', async () => {
                    console.log('帐户地址读取完毕');
                    const uids = Object.keys(accounts);
                    //对随机ID数据进行排序
                    uids.sort();
                    //按照排序后的ID顺序进行操作
                    //forEach内部的代码是同步执行的，这意味着await关键字后的异步操作会在下一个循环迭代开始之前才真正开始执行。
                    for (let index = 0; index < uids.length; index++) {
                        const uid = uids[index];
                        await callback(accounts[uid]);
                        if ((index + 1) < uids.length) {
                            const pauseTime = this.randomPause(this.minInterval, this.maxInterval, this.randomFactor);
                            console.log(`暂停 ${pauseTime} 秒`);
                            await this.sleep(pauseTime);
                        }
                    };
                    resolve('success');
                })
                .on('error', (error) => {
                    console.error('读取地址失败:', error);
                    reject(error);
                });
        });
    }
    //设置带随机因子，生成随机数
    //参数需为整数
    randomPause(minSeconds = this.minInterval, maxSeconds = this.maxInterval,factor = this.randomFactor) {
        const minPauseSeconds = Math.ceil(minSeconds);
        const maxPauseSeconds = Math.floor(maxSeconds);
        return Math.floor(Math.random() * (maxPauseSeconds - minPauseSeconds + 1)) + minPauseSeconds + factor;
    }
    
    async sendRequest(url, urlConfig, proxy, timeout = 10000, maxRetries = 5) {
        let retries = 0;
        let agent  = false;
        if(proxy){
            agent = new HttpsProxyAgent(proxy);
        }
        while (retries < maxRetries) {
            let source = axios.CancelToken.source();
            let timer = setTimeout(() => {
                source.cancel(`Request timed out after ${timeout} ms`);
            }, timeout);
    
            let newConfig = {
                ...urlConfig,
                httpAgent: agent, 
                httpsAgent: agent,
                url: url,
                timeout: timeout,
                cancelToken: source.token,
                //method: urlConfig.method || 'get',
                onDownloadProgress: () => clearTimeout(timer),
            };
    
            try {
                let response = await axios(newConfig);
                retries = maxRetries;
                return response.data;
            } catch (error) {
                console.error(error.message);
                if (error.message.includes('timed out') || error.code == 'ECONNRESET') {
                    retries++;
                    console.log(`网络请求超时，开始重试第 ${retries} 次`);
                } else{
                    throw error;
                }
            } finally {
                clearTimeout(timer);
            }
        }
    
        throw new Error(`Request failed after ${maxRetries} retries`);
    }
    
    async checkProxyIsON(proxy){
        let proxyVerified = false; // 代理验证标志
        if(!proxy){
            console.error('未配置代理服务，请检查。');
            return proxyVerified;
        }
        try {
            let proxyAttempts = 0; // 代理检查尝试次数
    
            while (!proxyVerified && proxyAttempts < this.max_proxy_check_attempts) {
                console.log('开始测试代理IP是否正常');
                try {
                    const response = await this.sendRequest('https://myip.ipip.net', '', proxy);
                    console.log('代理启动成功, 当前使用代理IP地址: ', response);
                    proxyVerified = true; // 代理验证成功
                } catch (error) {
                    proxyAttempts++;
                    console.log('代理失效，等待1分钟后重新验证,'+error);
                    await sleep(60); // 等待1分钟
                }
            }
    
            if (!proxyVerified) {
                console.log('代理验证失败，无法继续执行任务');
            }
        } catch (error) {
            console.error('发生错误:', error);
        }
        return proxyVerified;
    }
}

module.exports = Utils;