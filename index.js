const { Telegraf } = require('telegraf');
require('dotenv').config();
const $ = require('./src/service');
// 你的机器人令牌
const bot = new Telegraf(process.env.BOT_TOKEN);

//加载中间件
$.loadUse(bot);
// 加载私聊机器人
$.liveChat(bot);
//加载内联模式
$.inLine(bot);
//加载指令
//$.loadCommand(bot);
// 启动机器人
bot.launch();
console.log('Bot is running...');
