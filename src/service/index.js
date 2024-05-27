const fs = require('fs');
const path = require('path');

// 获取当前目录下的所有JS文件（排除index.js自己）
const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');

// 导出对象，用于存储所有导入的方法
const methods = {};

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const fileMethods = require(filePath);
  Object.assign(methods, fileMethods);
});

module.exports = methods;
