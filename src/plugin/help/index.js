/*
!name=帮助
!command=help
!description=查看所有指令列表，附加参数可以查看某一插件的具体介绍
*/
const utils = require('../utils')

function loadPlugin() {
    return {
        runScript
    }
}

async function runScript(bot, ctx, params) {
    let plugins = utils.getAllPlugins();
    const chatId = ctx.message.chat.id;
    let message=`*命令列表*:\n${plugins.join(", ")}`
    let sendMessage = await ctx.reply(message, { 
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'MarkdownV2' 
    });
    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 2e4);
}