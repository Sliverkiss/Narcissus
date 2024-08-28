import { Telegraf } from 'telegraf';
import PluginManager from './services/pluginManager.js';
import * as path from 'node:path';
import { CONFIG } from './config/index.js';
import { Model } from './database/index.js';
//全局属性
global.config = CONFIG;
global.Model = Model;

const bot = new Telegraf(config.botToken);
const pluginManager = new PluginManager(path.join(import.meta.dirname, 'plugins'));

bot.use((ctx, next) => {
    pluginManager.executePlugins(ctx);
    return next();
});

export { bot, pluginManager };