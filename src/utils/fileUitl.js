const fs = require('fs');
const path = require('path');

/**
 * 读取config目录下的cache目录中的JSON文件
 * @param {string} fileName - 文件名，不包括扩展名
 * @param {Object} [data] - 如果提供了data，未读取到文件内容时，将返回data
 * @returns {Object} - 读取时返回文件内容的对象
 */
function getData(fileName, data) {
  // 获取项目根目录路径
  const rootDir = path.resolve(__dirname, '..');
  const configDir = path.join(rootDir, 'config');
  const cacheDir = path.join(configDir, 'cache');
  const filePath = path.join(cacheDir, `${fileName}.json`);
  // 检查并创建config和cache目录
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }
  // 读取文件内容
  try {
    if (!fs.existsSync(filePath)) {
      // 如果文件不存在，则创建一个空的JSON文件并返回默认值
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2), 'utf8');
      console.log(`文件 ${filePath} 不存在，已创建空文件`);
      return data;
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedContent = JSON.parse(fileContent);

    // 如果文件内容为空对象，返回传入的默认值
    if (Object.keys(parsedContent).length === 0) {
      return data;
    }

    return parsedContent;
  } catch (error) {
    console.error(`读取文件时出错: ${error.message}`);
    return data; // 如果读取出错，返回默认值
  }
}

/**
 * 写入config目录下的cache目录中的JSON文件
 * @param {string} fileName - 文件名，不包括扩展名
 * @param {Object} [data] - 如果提供了data，将写入该数据到文件
 * @returns {undefined} - 写入时无返回值
 */
function setData(fileName, data) {
  // 获取项目根目录路径
  const rootDir = path.resolve(__dirname, '..');
  const configDir = path.join(rootDir, 'config');
  const cacheDir = path.join(configDir, 'cache');
  const filePath = path.join(cacheDir, `${fileName}.json`);

  // 检查并创建config和cache目录
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`数据已写入到 ${filePath}`);
  } catch (error) {
    console.error(`写入文件时出错: ${error.message}`);
  }
}


/**
 * 获取根目录下 plugin 目录中的所有插件
 * @returns {string[]} - 子目录名称数组
 */
function getAllPlugins() {
  try {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建 plugin 目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugin');

    // 读取 plugin 目录中的所有内容
    const filesAndDirs = fs.readdirSync(pluginDir);

    // 过滤出其中的目录
    const directories = filesAndDirs.filter(item => {
      const itemPath = path.join(pluginDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    return directories;
  } catch (error) {
    console.error(`获取插件目录时出错: ${error.message}`);
    return [];
  }
}

/**
 * 获取根目录下 plugin 目录中的某个子目录下 index.js 文件的内容
 * @param {string} pluginName - 子目录名称
 * @returns {string} - 文件内容
 */
function getPlugin(pluginName) {
  try {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建子目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugin', pluginName);
    // 构建 index.js 文件的绝对路径
    const indexPath = path.join(pluginDir, 'index.js');
    // 检查文件是否存在
    if (!fs.existsSync(indexPath)) {
      throw new Error(`文件 ${indexPath} 不存在`);
    }
    // 读取文件内容
    const fileContent = fs.readFileSync(indexPath, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error(`读取插件文件时出错: ${error.message}`);
    return null;
  }
}
/**
 * 安装插件
 * @param {string} pluginName - 插件名称
 * @param {string} fileContent - 文件内容
 * @returns {boolean} - 是否安装成功
 */
function addPlugin(pluginName, fileContent) {
  try {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建子目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugin', pluginName);
    // 构建 index.js 文件的绝对路径
    const indexPath = path.join(pluginDir, 'index.js');
    // 检查文件是否存在
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir);
    }
    try {
      // 写入文件内容
      fs.writeFileSync(indexPath, fileContent);
      console.log(`数据已写入到 ${indexPath}`);
      return true;
    } catch (error) {
      console.error(`写入文件时出错: ${error.message}`);
    }
  } catch (error) {
    return null;
  }
}

/**
 * 移除插件
 * @param {string} pluginName - 插件名称
 * @returns {string} - 文件内容
 */
function deletePlugin(pluginName) {
  try {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建子目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugin', pluginName);
    // 构建 index.js 文件的绝对路径
    const indexPath = path.join(pluginDir, 'index.js');
    try {
      // 删除目录及其所有文件
      fs.rmdirSync(pluginDir, { recursive: true });
      console.log(`Successfully removed plugin ${indexPath}!`);
      return true;
    } catch (error) {
      console.error(`删除插件时出错: ${error.message}`);
    }
  } catch (error) {
    return null;
  }
}


module.exports = { getData, setData, getAllPlugins, getPlugin, addPlugin,deletePlugin };