const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Cipher = require('../../utils/cipher');

/**
 * 
 * @param {String} inputFilePath 读取CSV源文件位置
 * @param {String} outputFilePath 输出结果CSV文件存储位置
 * @param {JSON} addMap 可为空，需要额外添加的列key，及对应值数组，{key1:[arr1,arr2],key2:[arr3,arr4]}
 */
function convertCsv(inputFilePath, outputFilePath, addMap) {
    const secretKey = Cipher.getKeyFromUser();
    let results = [];

    /**
     * 创建获取数组下一个值的应用类
     * mark 是自动索引
     * arr[] 是需要迭代的数组
     */
    class ArrayNext{
        mark = 0;
        arr = [];
        constructor(array){
            this.arr = array;
            //console.log('constructor:',this.arr);
        }
        getNext(){
            //console.log('getNext',this.arr);
            if(this.mark >= this.arr.length){
                this.mark = 0;
            }
            //console.log('this.mark:',this.mark);
            let value = this.arr[this.mark];
            this.mark++;
            return value;
        }
    }
    //设置一个读取参数数组
    let paramArr = {};
    //如果存在addMap参数
    if(addMap){
        //为paramArr赋值：key是等于addmap的key；value是ArrayNext类
        Object.keys(addMap).forEach(key=>{
            //遍历参数addmap，取key即要添加的列key，对应的addmap[key]即这列要获得的数组
            paramArr[key] = new ArrayNext(addMap[key]);
        });
    }

    fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', (row) => {
            if (row['privateKey']) {
                //对privateKey 进行加密处理后存储
                row['privateKey'] = Cipher.encrypt(row['privateKey'], secretKey);
            }
            //如源文件包含mnemonic，则不存储、转换、助记词
            if(row['mnemonic']){
                delete row['mnemonic'];
            }
            if(addMap){
                Object.keys(addMap).forEach(key =>{
                    //为生成result添加列key
                    row[key] = paramArr[key].getNext();
                });
            }
            results.push(row);
        })
        .on('end', () => {
            const csvWriter = createCsvWriter({
                path: outputFilePath,
                header: Object.keys(results[0]).map((key) => ({id: key, title: key})),
            });
            csvWriter.writeRecords(results)
                .then(() => {
                    console.log('文档写入完成');
                }).catch((error)=>{
                    console.error('写入csv文件错误', error);
                });
        });
}
module.exports = {convertCsv};
