const { spawn } = require('child_process');
const readlineSync = require('readline-sync');
const path = require('path');

// 脚本路径列表，相对当前文件目录路径
const pathArray = [
    ['./pumpx/', 'pumpxTask.js'],
];

const password = readlineSync.question('请输入密码: ', {
    hideEchoBack: true  // 隐藏显示输入信息
});

function runStart(index) {
    const basedir = __dirname;
    if (index < pathArray.length) {
        const scriptName = path.basename(pathArray[index][1]);
        
        console.log(`开始执行脚本: ${scriptName}`);
        
        const childProcess = spawn('node', [scriptName], {
            cwd: pathArray[index][0],
            env: { SCRIPT_PASSWORD: password },
            stdio: 'inherit'
        });
        
        childProcess.on('close', () => {
            console.log(`脚本 ${scriptName} 执行完成`);
            runScript(index + 1);
        });
    }
}
runStart(0);