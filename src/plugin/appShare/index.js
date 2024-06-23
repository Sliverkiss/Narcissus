/*
!command=appShare
!content=苹果账号共享
*/
const AppData = require('../plugin/appShare/appIds.json');

const { Markup } = require('telegraf');

let appList = [...AppData.info.app, ...AppData.info.game]

function loadPlugin() {
    return {
        runScript
    }
}

async function runScript(bot, ctx, data) {
    // 获取传入的参数
    const params = data.map(e=>e.toLocaleLowerCase());
    // 检查是否传入了参数
    if (!params) {
        // 通知删除信息
        const replyMessage = await ctx.reply('⚠️ 请在指令输入关键词！', {
            reply_to_message_id: ctx.message.message_id,
        });
        let replyMessageId = replyMessage.message_id;
        // 两秒后删除打印删除消息数量的消息
        setTimeout(() => {
            ctx.telegram.deleteMessage(ctx.chat.id, replyMessageId);
        }, 2000);
        return;
    }
    let appInfo = appList.filter(e => e.name.toLocaleLowerCase().includes(params));

    if (!appInfo.length) {
        // 通知删除信息
        const replyMessage = await ctx.reply(`⚠️ 未查询到相关软件，请输入合理的关键词！`, {
            reply_to_message_id: ctx.message.message_id,
        });
        let replyMessageId = replyMessage.message_id;
        // 两秒后删除打印删除消息数量的消息
        setTimeout(() => {
            ctx.telegram.deleteMessage(ctx.chat.id, replyMessageId);
        }, 2000);
        return;
    }
    const buttons = appInfo.map(option => Markup.button.callback(option.name, option.name));

    appInfo.forEach(option => {
        bot.action(option.name, async (ctx) => {
            ctx.editMessageText('正在查询账号数据，请稍等...');
            // 修改按钮的回复消息为打印 "hello"
            try {
                let res = await getID(option.account);
                const { username, password } = res?.accounts[0];
                let message = `<b>${option.name}</b>\n<pre>${username}</pre>\n<pre>${password}</pre>`
                ctx.editMessageText(message, { parse_mode: 'HTML' });
            } catch (e) {
                let repMessage = await ctx.editMessageText('⚠️ 查询失败！该账号已失效~');
                // 两秒后删除打印删除消息数量的消息
                setTimeout(() => {
                    ctx.telegram.deleteMessage(ctx.chat.id, repMessage.message_id);
                }, 2000);
            }
        });
    });
    // 回复调用指令的信息，并发送按钮选项
    ctx.reply(`请选择要获取的共享账号`, Markup.inlineKeyboard(buttons));
}



async function getID(url) {
    const res = await fetch(url).then(res => res.json());
    console.log(res);
    return res;
}

