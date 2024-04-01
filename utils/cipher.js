const crypto = require('crypto');
const readlineSync = require('readline-sync');

class Cipher{

    //获取用户输入key
    static getKeyFromUser() {
        let key;
        if (process.env.SCRIPT_PASSWORD) {
            key = process.env.SCRIPT_PASSWORD;
        } else {
            key = readlineSync.question('请输入你的密码: ', {
                hideEchoBack: true,
            });
        }
        //console.log('substring'+ key.substring(0,32));
        //console.log('substr   '+ key.substr(0,32));
        //console.log(crypto.createHash('sha256').update(String(key)).digest('base64').substring(0,32));
        return crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);
    }
    // 加密函数
    static encrypt(text, secretKey) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    //解密函数
    static decrypt(text, secretKey) {
        if(!text){
            //如需解密参数为空，则直接返回
            return;
        }
        try {
            let parts = text.split(':');
            let iv = Buffer.from(parts.shift(), 'hex');
            let encryptedText = Buffer.from(parts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            if(error.code == 'ERR_OSSL_BAD_DECRYPT'){
                throw new Error('密码输入错误');
            }
        }
    }
}

module.exports = Cipher;