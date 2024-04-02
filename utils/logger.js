const fs = require('fs');

class logger {
    logFilePath = '';
    constructor(logFilePath) {
        this.logFilePath = logFilePath;
    }
    log(message) {
        const logEntry = `${new Date().toLocaleString()}: ${message}\n`;
        fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
    }
    //以英文逗号’,’分割格式装填message
    logByCsv(message) {
        const logEntry = `${new Date().toLocaleString()},${message}\n`;
        fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
    }
}
module.exports = logger;