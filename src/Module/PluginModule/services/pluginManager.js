import * as fs from 'node:fs';
import * as path from 'node:path';
import * as chokidar from 'chokidar';
import {Logger} from '../../../System/Utils/logger.js';
import * as url from 'node:url';
import { createRequire } from 'module'; // Node.js v12.17.0+

const logger = Logger.getLogger('PluginManager');
class PluginManager {
  constructor(pluginDir) {
    this.plugins = [];
    this.pluginDir = pluginDir;
    this.watcher = null;
    this.loadPlugins();
    this.watchPluginDirectory();
  }

  async loadPlugins() {
    const pluginFiles = fs.readdirSync(this.pluginDir).filter(file =>
                                                                  file.endsWith('.js') && file !== 'index.js');
    const prePlugins = [];
    for (const pluginFile of pluginFiles) {
      const fullPath = path.join(this.pluginDir, pluginFile);
      // 清除缓存
      const require = createRequire(import.meta.url); // 使用 createRequire 从当前模块中获取 require
      delete require.cache[require.resolve(fullPath)];
      const plugin = (await import(url.pathToFileURL(fullPath))).default;
    
      if ((typeof plugin.execute) !== 'function') {
        logger.error(`发现疑似错误插件: ${fullPath}, 该插件中并无execute方法`);
        continue;
      }
      if (!plugin.name) {
        const suffix = pluginFile.indexOf('.');
        const fileName = suffix === -1 ? pluginFile : pluginFile.substring(0, suffix);
        plugin.name = fileName;
        logger.warn(`找不到插件${fullPath}的插件名，使用文件名作为插件名:${fileName}`);
      }
      prePlugins.push(plugin);
    }
    this.plugins = prePlugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  watchPluginDirectory() {
    this.watcher = chokidar.watch(this.pluginDir, {
      ignored: /(^|[\/\\])\../, // 忽略隐藏文件
      persistent: true
    });

    this.watcher
      .on('add', this.handlePluginChange.bind(this))
      .on('change', this.handlePluginChange.bind(this))
      .on('unlink', this.handlePluginChange.bind(this));
  }

  handlePluginChange(path) {
    logger.info(`检测到插件变化: ${path}`);
    this.loadPlugins();
  }

  executePlugins(ctx) {
    this.plugins.forEach(plugin => {
      try {
        //如果是管理员，则执行命令
        if($?.isAdmin(ctx)||plugin?.promise=='personal') plugin?.execute(ctx);
      } catch (error) {
        logger.error(`执行插件 ${plugin?.name} 时出错:`, error);
      }
    });
  }

  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

export default PluginManager;