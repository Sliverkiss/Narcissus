/*
!command=help
!content=获取所有命令信息
*/


const utils = require('../utils')

async function runScript(ctx) {
    const directories = utils.getAllCommand();

    let helpMessage = 'Available commands:\n\n';

    directories.forEach(dir => {
        const scriptContent = utils.getCommand(dir);
        // 匹配 !command 和 !content 的正则表达式
        const regex = /!command=(\w+)\n!content=(.+)/;
        // 使用正则表达式匹配
        const match = scriptContent.match(regex);
        if (match) {
            const command = match[1].trim(); // 获取 !command 的值
            const content = match[2].trim(); // 获取 !content 的值
            helpMessage += `/${command} - ${content}\n`;
        }
    });
    // 通知删除信息
    const replyMessage = await ctx.reply(helpMessage, { reply_to_message_id: ctx.message.message_id });
    let replyMessageId = replyMessage.message_id;
    // 20秒后删除打印删除消息数量的消息
    setTimeout(() => {
        ctx.telegram.deleteMessage(ctx.chat.id, replyMessageId);
    }, 2e4);
}