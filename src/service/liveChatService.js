const utils = require('../utils');

async function liveChat(bot) {
    // 从cache.json中读取userMessageMap
    let userMessageMap = utils.getData('liveChat',new Map());
    // 处理私聊消息
    bot.on('message', async (ctx) => {
        const chatId = ctx.chat.id;
        const messageId = ctx.message.message_id;
        const adminUserId = process.env.USER_ID;
        //如果不是来自私聊，则停止服务。
        if (ctx.chat.type != 'private') return;
        // 如果消息来自管理员
        if (chatId == adminUserId) {
            const originalMessageId = ctx.message.reply_to_message && ctx.message.reply_to_message.message_id;
            // 如果是回复消息，并且映射中存在对应的用户ID
            if (originalMessageId) {
                const originalUserId = userMessageMap.get(originalMessageId);
                // 如果映射中存在对应的用户ID
                if (originalUserId) {
                    const message = ctx.message;
                    // 逐个处理不同类型的消息
                    if (message.text) {
                        await ctx.telegram.sendMessage(originalUserId, message.text);
                    } else if (message.photo) {
                        const photo = message.photo.pop(); // 获取最后一张图片
                        await ctx.telegram.sendPhoto(originalUserId, photo.file_id);
                    } else if (message.document) {
                        await ctx.telegram.sendDocument(originalUserId, message.document.file_id);
                    } else if (message.video) {
                        await ctx.telegram.sendVideo(originalUserId, message.video.file_id);
                    } else if (message.audio) {
                        await ctx.telegram.sendAudio(originalUserId, message.audio.file_id);
                    } else if (message.sticker) {
                        await ctx.telegram.sendSticker(originalUserId, message.sticker.file_id);
                    } else {
                        // 如果管理员发送的是其他类型的消息，可以根据需要添加更多的处理逻辑
                        // 比如处理动画、位置、联系人等其他类型的消息
                    }
                }
            }
        } else {
            // 将用户消息转发给管理员
            try {
                const sentMessage = await ctx.telegram.forwardMessage(adminUserId, chatId, messageId);
                userMessageMap.set(sentMessage.message_id, chatId);
                // 将userMessageMap写入cache.json
                utils.setData('liveChat',[...userMessageMap]);
            } catch (error) {
                console.error('Error forwarding message to admin:', error);
            }
        }
    });
}

module.exports = { liveChat };