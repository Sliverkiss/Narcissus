export default {
    name: 'AutoDelete Plugin',
    priority: 1000,
    execute: async (ctx, next) => {
        // 存储原始的 ctx.reply 方法
        const originalReply = ctx.reply.bind(ctx);
        // 重写 ctx.reply 方法
        ctx.reply = async (...args) => {
            const options = args[1] || {};
            // 如果 ctx.message 存在，添加 reply_to_message_id 选项
            if (ctx?.message && ctx?.message?.message_id) {
                options.reply_to_message_id = ctx?.message?.reply_to_message?.message_id || ctx.message.message_id;
            }
            // 调用原始的 ctx.reply 方法并传递修改后的选项
            const sentMessage = await originalReply(args[0], options);
            // 检查是否是 bot 发送的消息
            if (sentMessage && sentMessage?.message_id) {
                const messageId = sentMessage?.message_id;
                const chatId = sentMessage?.chat.id;
                let command=ctx?.message?.text?.split(" ")[0];
                logger.info(`检测到指令:${command}`);
                logger.info(`记录消息 -> Bot's message ID: ${messageId} in chat ${chatId}`);

                // 设置定时删除
                setTimeout(async () => {
                    try {
                        await ctx.telegram.deleteMessage(chatId, messageId);
                        logger.info(
                            `删除消息 -> Bot's message ID: ${messageId} deleted from chat ${chatId}`
                        );
                    } catch (error) {
                        logger.error(
                            `Failed to delete bot's message ID: ${messageId} from chat ${chatId}`,
                            error
                        );
                    }
                }, 6e4); // 90秒后删除消息
            }
            // 返回发送的消息
            return sentMessage;
        };
    }
};