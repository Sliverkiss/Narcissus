/*
!name=插件管理
!command=apt
!description=用于管理bot的插件
*/
const utils = require('../utils')

function loadPlugin() {
    return {
        runScript, install,remove
    }
}

async function runScript(bot, ctx, params) {
    let sendMessage = await ctx.reply("*⚠️ 请执行具体的方法*:\n```install、remove```", {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'MarkdownV2'
    });
    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 2e4);
}

async function install(bot, ctx, params) {

    let pluginName = "";
    let pluginContent = "";

    const message = ctx.message.reply_to_message;
    //检查回复的消息中是否包含文件
    if (message?.document) {
        // 获取文件信息
        const file = message.document;
        const fileId = file.file_id;
        const fileName = file.file_name;
        // 下载文件
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const response = await fetch(fileLink.href);
        pluginContent = await response.text();
        //提取插件名称
        pluginName = fileName.replace(/\.js$/, '');
        //安装插件
    }
    //检查是否包含参数，且参数为url
    try {
        if (utils.addPlugin(pluginName, pluginContent)) {
            // 通知删除信息
            const replyMessage = await ctx.reply(`安装 ${pluginName} 插件成功`, { reply_to_message_id: ctx.message.message_id });
            let replyMessageId = replyMessage.message_id;
            // 两秒后删除打印删除消息数量的消息
            setTimeout(() => {
                ctx.telegram.deleteMessage(ctx.chat.id, replyMessageId);
            }, 2000);
        }
    } catch (e) {
        console.error('Error installing file:', error);
        // 通知删除信息
        const replyMessage = await ctx.reply(`安装插件时出错：${error}`, { reply_to_message_id: ctx.message.message_id });
        let replyMessageId = replyMessage.message_id;
        // 两秒后删除打印删除消息数量的消息
        setTimeout(() => {
            ctx.telegram.deleteMessage(ctx.chat.id, replyMessageId);
        }, 2000);
    }
}

async function remove(bot, ctx, params) {
    const [pluginName,] = params;
    let message = '';
    try {
        message = utils.deletePlugin(pluginName)
            ? `卸载 ${pluginName} 插件成功!`
            : `卸载 ${pluginName} 插件失败!`
    } catch (e) {
        message = `卸载 ${pluginName} 插件失败!\nError:${e}`
    } finally {
        // 通知删除信息
        const replyMessage = await ctx.reply(message, { reply_to_message_id: ctx.message.message_id });
        let replyMessageId = replyMessage.message_id;
        // 两秒后删除打印删除消息数量的消息
        setTimeout(() => {
            ctx.telegram.deleteMessage(ctx.chat.id, replyMessageId);
        }, 2000);
    }
}