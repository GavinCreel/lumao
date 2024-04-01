const {convertCsv} = require('../../utils/convert/accountConvert');

const inputPath = './originWallet.csv'; // 输入的CSV文件路径
const outputPath = './resultWallet.csv'; // 输出的CSV文件路径

function main(){
    const proxyIPs = [

    ];
    let addMap = {
        'proxy': proxyIPs,
        'invitecode':[

        ]
    }
    convertCsv(inputPath, outputPath, addMap);
}
main()