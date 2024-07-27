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

  /**
   * 通过url安装插件
   * @param {string} url url
   * @param {string} pluginName 插件名
   */
  async installFromUrl(url, pluginName) {
    const pluginPath = path.join(this.pluginDir, pluginName, '.js');
    if (fs.existsSync(pluginPath)) {
      throw new Error(`插件:${pluginName} 已存在`);
    }
    // 发起 HTTP 请求
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态:${response.status}`);
    }
    const uint8Array = new Uint8Array(await response.arrayBuffer());
    fs.writeFileSync(pluginPath, uint8Array);
  }

  /**
   * 卸载插件
   * @param pluginName 插件名
   */
  uninstallPlugin(pluginName) {
    const pluginPath = path.join(this.pluginDir, pluginName, '.js');
    fs.unlinkSync(pluginPath);
  }
}

module.exports = PluginManager;