const fs = require('fs');

class logger {
    logFilePath = '';
    //如未传参数，则默认按照当前日期生成文件名
    constructor(logFilePath) {
        if(!logFilePath){
            let d = new Date();
            logFilePath = d.getFullYear()+'-'+(d.getMonth()+1) +'-'+d.getDate()+'.csv';
        }
        this.logFilePath = logFilePath;
    }
    log(message) {
        const logEntry = `${new Date().toLocaleString()}: ${message}\n`;
        fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
    }
    //要求：以英文逗号’,’分割格式装填message
    logByCsv(message) {
        const logEntry = `${new Date().toLocaleString()},${message}\n`;
        fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
    }
}
module.exports = logger;