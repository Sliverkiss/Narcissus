/*
!name=白名单管理
!command=apt
!description=用于管理bot的白名单，接受谁的调用
*/
const utils = require('../utils')

function loadPlugin() {
    return {
        runScript, add, remove
    }
}

async function runScript(bot, ctx, params) {
    let whitelist = utils.getData('whitelist');
    let sendMessage = await ctx.reply(`*⚠️ 用户白名单*:\n${whitelist}`, {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'MarkdownV2'
    });
    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 2e4);
}

async function add(bot, ctx, params) {
    let whitelist = utils.getData('whitelist');
    const userId = ctx.message.from.id;
    if (whitelist.includes(userId)) {
        ctx.reply("哼，你已经是本bot的服务对象啦！")
        return;
    }
    whitelist.push(userId);
    whitelist = [...new Set(whitelist)];
    utils.setData('whitelist', JSON.stringify(whitelist));
    
}

async function remove(bot, ctx, params) {
    let whitelist = utils.getData('whitelist');
    const userId = ctx.message.from.id;
    if (!whitelist.includes(userId)) {
        ctx.reply("该用户本bot的服务名单之内，无需移除～")
        return;
    }
    whitelist = whitelist.filter(e => e != userId);
    utils.setData('whitelist', JSON.stringify(whitelist));
}