const Wallet = require('ethereumjs-wallet');
const Bip39 = require('bip39')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//给定word值
const words = []
let wordid = 0;
function getNextword(){
    if(wordid >= words.length){
        wordid = 0;
    }
    let value = words[wordid];
    wordid++;
    return value;
}
/*
参考：
HD钱包生成方法
https://medium.com/taipei-ethereum-meetup/%E8%99%9B%E6%93%AC%E8%B2%A8%E5%B9%A3%E9%8C%A2%E5%8C%85-%E5%BE%9E-bip32-bip39-bip44-%E5%88%B0-ethereum-hd-%EF%BD%97allet-a40b1c87c1f7
coin_type 说明
https://github.com/satoshilabs/slips/blob/master/slip-0044.md
HD wallet 说明
https://www.wenjiangs.com/doc/d3ususqcbc
*/
function batchGen(mnemonic, num = 50){
    if(!mnemonic){
        console.error('请提供助记词 Mnemonic');
        return;
    }
    let records = [];
    //將 mnemonic code 轉成 binary 的 seed
    //const password = 'nothing.is/impossible';
    const seed = Bip39.mnemonicToSeedSync(mnemonic);
    //使用 seed 產生 HD Wallet
    const hdWallet = Wallet.hdkey.fromMasterSeed(seed);
    let i = 0;
    while(i < num){
        //產生 Wallet 中第一個帳戶的第一組 keypair。可以從 Master Key，根據其路徑 m/44'/60'/0'/0/0 推導出來。
        //m / purpose' / coin_type' / account' / change / address_index
        //Bitcoin 就是 0'，Ethereum 是 60'
        //https://zhuanlan.zhihu.com/p/30297080
        const keyPair = hdWallet.derivePath(`m/44'/60'/0'/0/${i}`);
        //使用該 keypair 產生 wallet 物件。
        const wallet1 = keyPair.getWallet();
        //取得該 wallet 的 address。
        const address1 = wallet1.getChecksumAddressString();
        //获取privateKey
        const privateKey = wallet1.getPrivateKeyString();
        let data = {
            mnemonic:mnemonic,
            address:address1,
            privateKey:privateKey
        }
        records.push(data);
        i++;
    }
    return records;
}

//產生 mnemonic code
//默认使用系统生成
//可按照提供word生成
function getMnemonic(flag = true){
    if(flag){
        return Bip39.generateMnemonic();
    }
    return getNextword();
}
function launch(num = 5000){
    let records = [];
    const batchNum = 50;
    for (let index = 0; index < num/batchNum; index++) {
        let data = batchGen(getMnemonic(), batchNum);
        records.push(...data);
        console.log('生成第',index*batchNum+1,' - ',batchNum*(index+1),'个wallet');
    }

    // 定义CSV文件的列头
    const csvWriter = createCsvWriter({
        path: 'walletList.csv',
        header: [
            {id: 'mnemonic', title: 'mnemonic'},
            {id: 'address', title: 'address'},
            {id: 'privateKey', title: 'privateKey'}
        ],
        //append: true    // 设置为true表示附加到已存在的CSV文件中
    });
    csvWriter.writeRecords(records)
    .then(() => {
        console.log('CSV文档保存完成');
    }).catch((error)=>{
        console.error('写入csv文件错误', error);
    });
}
launch();