import {Message} from '../database/index.js';

export default {
    name: '【双向私聊机器人】',
    promise: "personal",
    execute: async (ctx) => {
        try {
            if (ctx?.message && ctx?.chat?.type == 'private') {
                const chatId = ctx?.chat?.id;
                const messageId = ctx?.message?.message_id;
                const adminUserId = config.adminId;

                // 确保数据库表已创建
                await Message.initialize();

                // 如果消息来自管理员
                if (chatId == adminUserId) {
                    const originalMessageId = ctx.message.reply_to_message && ctx.message.reply_to_message.message_id;
                    // 如果是回复消息
                    if (originalMessageId) {
                        const messageRecord = await Message.findByAdminMessageId(originalMessageId);
                        // 如果数据库中存在对应的用户ID
                        if (messageRecord) {
                            const originalUserId = messageRecord.userId;
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
                            }
                        }
                    }
                } else {
                    // 将用户消息转发给管理员
                    try {
                        const sentMessage = await ctx.telegram.forwardMessage(adminUserId, chatId, messageId);
                        await Message.createOrUpdate(sentMessage.message_id, chatId);
                    } catch (error) {
                        console.error('Error forwarding message to admin:', error);
                    }
                }
            }
        } catch (e) {
            logger.error(e);
        }
    }
};