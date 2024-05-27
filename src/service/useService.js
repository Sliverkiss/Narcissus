const utils = require('../utils');
const { execSync, exec } = require('child_process');


const creatorId = process.env.USER_ID;
// 白名单用户ID数组，替换为实际用户ID
const whitelist = utils.getData('whitelist')||[];

// 检查消息是否来自机器人创建者或白名单用户
function isFromCreatorOrWhitelist(ctx) {
    const userId = ctx.message.from.id;
    return (userId == creatorId) || whitelist.includes(userId);
}

// 加载中间件
async function loadUse(bot) {
    // 中间件处理函数
    bot.use(async (ctx, next) => {
        try {
            if (ctx.message && isFromCreatorOrWhitelist(ctx)) {
                const messageText = ctx.message.text;
                if (!messageText) return next(); // 执行下一步逻辑
                if (messageText.startsWith(',')) {
                    let command = utils.parseCommand(messageText);
                    console.log(`检测到指令:${command.command},开始执行相关任务...`);
                    let sendMessage = await ctx.reply(`Command: ${command.command}`, { reply_to_message_id: ctx.message.message_id });
                    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 1e3);
                    runCommand(bot, ctx, command);
                    return; // 停止执行其它命令
                }
            }
            return next(); // 执行下一步逻辑
        } catch (e) {
            ctx.reply(`⚠️ Error: ${e}`);
        }
    });
}

//运行中间件任务
async function runCommand(bot, ctx, command) {
    try {
        const { command: pluginName, params } = command;
        //热加载插件内容
        let scriptContent = utils.getPlugin(pluginName);
        if (!scriptContent) {
            let sendMessage = await ctx.reply(`⚠️ Error: command ${pluginName} 指令不存在！`, { reply_to_message_id: ctx.message.message_id });
            setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 2e3);
            return;
        }
        //加载插件
        eval(scriptContent);
        let plugin = loadPlugin();
        //如果调用的是子方法
        if (params[0] in plugin) {
            let [func, ...data] = params;
            plugin[func]?.(bot, ctx, data);
            return;
        }
        try {
            //否则调用runScript方法
            plugin.runScript(bot, ctx, params);
        } catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                const missingModule = error.message.match(/'(.+?)'/)[1];
                console.log(`缺少依赖: ${missingModule}`);
                installDependency(missingModule).then(() => {
                    console.log(`重新运行脚本...`);
                    plugin.runScript(bot, ctx, params); // 依赖安装完成后重新运行脚本
                }).catch(err => {
                    console.error('依赖安装失败:', err);
                });
            } else {
                throw e;
            }
        }
    } catch (e) {
        ctx.reply(`Error: ${e}`);
    }
}

// 自动安装依赖
function installDependency(dependency) {
    return new Promise((resolve, reject) => {
        console.log(`正在安装缺少的依赖: ${dependency}`);
        exec(`npm install ${dependency}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`安装 ${dependency} 时出错:`, stderr);
                reject(error);
            } else {
                console.log(`${dependency} 安装完成`);
                resolve();
            }
        });
    });
}


module.exports = { loadUse };