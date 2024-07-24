const fs = require('fs');
const path = require('path');

function loadPlugins() {
  const pluginFiles = fs.readdirSync(__dirname).filter(file => 
    file !== 'index.js' && file.endsWith('.js')
  );

  const plugins = pluginFiles.map(file => {
    const plugin = require(path.join(__dirname, file));
    return plugin;
  });

  // 根据优先级排序插件，优先级高的排在前面
  return plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

module.exports = loadPlugins();