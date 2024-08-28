import {bot, pluginManager} from './src/bot.js';
//在这里加载插件(总感觉放全局有点不太妥，但尊重作者意思，后续再看看有没有优化的空间)


//加载全局工具类
await import('./src/System/Utils/index.js');
//加载全局Entity
await import('./src/System/Entity/index.js');


//具体实现的业务
bot.launch().then(() => {
  logger.info('机器人已启动并正在运行！');
}).catch(error => {
  logger.error('启动机器人时出错:', error);
});

// 优雅地停止bot (例如在ctrl-c时)
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  pluginManager.stopWatching();
  logger.info('机器人已停止运行 (SIGINT)');
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  pluginManager.stopWatching();
  logger.info('机器人已停止运行 (SIGTERM)');
});