import * as fs from 'node:fs';
import * as path from 'node:path';

export function loadPlugins() {
  const pluginFiles = fs.readdirSync(__dirname).filter(file => 
    file !== 'index.js' && file.endsWith('.js')
  );

  const plugins = pluginFiles.map(async file => {
    return await (import(path.join(__dirname, file))).default;
  });

  // 根据优先级排序插件，优先级高的排在前面
  return plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}