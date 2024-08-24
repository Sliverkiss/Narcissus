// 获取当前目录下的所有JS文件（排除index.js自己）
import * as path from 'node:path';
import * as fs from 'node:fs';
import {$} from './$.js';
global.$ = $;
const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');
// 导出对象，用于存储所有导入的方法
const methods = {};
for (const file of files) {
    const filePath = path.join(__dirname, file);
    const regex = /\/([^\/.]+)\.[^.\/]+$/;
    const match = filePath.match(regex);

    if (match) {
        console.log(match[1]); // 输出: logger
    } else {
        console.log('未找到匹配的文件名');
    }
    const obj = match[1];
    const fileMethods = await import(filePath);
    global[obj] = fileMethods.default;
    //加载全局方法
    Object.assign(methods, fileMethods);
}

export default methods;
