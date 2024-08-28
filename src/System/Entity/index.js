// 获取当前目录下的所有JS文件（排除index.js自己）
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from 'node:url';
import {Logger} from '../Utils/logger.js';

const log = Logger.getLogger('utils');
const files = fs.readdirSync(import.meta.dirname).filter(file => file.endsWith('.js') && file !== 'index.js');
// 导出对象，用于存储所有导入的方法
const methods = {};
for (const file of files) {
    const filePath = path.join(import.meta.dirname, file);
    const unixSplitIndex = filePath.lastIndexOf('/');
    const ntSplitIndex = filePath.lastIndexOf('\\');
    const index = Math.max(unixSplitIndex, ntSplitIndex);
    const fileName = (index === -1 ? filePath : filePath.substring(index + 1));
    const endIndex = fileName.lastIndexOf('.');
    const pluginName = (endIndex === -1 ? fileName : fileName.substring(0, endIndex));
    const fileMethods = await import(url.pathToFileURL(filePath));
    global[pluginName] = fileMethods.default;
    //log.info(`加载插件:${fileName}=>${pluginName}完成`);
    //加载全局方法
    Object.assign(methods, fileMethods);
}

export default methods;
