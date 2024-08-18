const { Telegraf } = require('telegraf');
const path = require('path');
const config = require('./config');
const PluginManager = require('./services/pluginManager');
const logger = require('./utils/logger');


const bot = new Telegraf(config.botToken);
const pluginManager = new PluginManager(path.join(__dirname, 'plugins'));

bot.use((ctx, next) => {
  pluginManager.executePlugins(ctx);
  return next();
});

module.exports = { bot, pluginManager };