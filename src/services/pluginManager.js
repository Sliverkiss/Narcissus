const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const logger = require('../utils');

class PluginManager {
  constructor(pluginDir) {
    this.plugins = [];
    this.pluginDir = pluginDir;
    this.watcher = null;
    this.loadPlugins();
    this.watchPluginDirectory();
  }

  loadPlugins() {
    const pluginFiles = fs.readdirSync(this.pluginDir).filter(file => 
      file.endsWith('.js') && file !== 'index.js'
    );

    this.plugins = pluginFiles.map(file => {
      const fullPath = path.join(this.pluginDir, file);
      delete require.cache[require.resolve(fullPath)];
      const plugin = require(fullPath);
      return plugin;
    });

    this.plugins.sort((a, b) => (b.priority||0) - (a.priority||0));
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
        if($.isAdmin(ctx)||plugin.promise=='personal') plugin.execute(ctx);
      } catch (error) {
        logger.error(`执行插件 ${plugin.name} 时出错:`, error);
      }
    });
  }

  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

module.exports = PluginManager;