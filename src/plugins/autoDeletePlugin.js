module.exports = {
    name: 'AutoDelete Plugin',
    priority: 1000,
    execute: async (ctx, next) => {
        // 存储原始的 ctx.reply 方法
        const originalReply = ctx.reply.bind(ctx);
        // 重写 ctx.reply 方法
        ctx.reply = async (...args) => {
            const sentMessage = await originalReply(...args);
            // 检查是否是 bot 发送的消息
            if (sentMessage && sentMessage?.message_id) {
                const messageId = sentMessage?.message_id;
                const chatId = sentMessage?.chat.id;

                console.log(`Bot's message ID: ${messageId} in chat ${chatId}`);

                // 设置定时删除
                setTimeout(async () => {
                    try {
                        await ctx.telegram.deleteMessage(chatId, messageId);
                        console.log(
                            `Bot's message ID: ${messageId} deleted from chat ${chatId}`
                        );
                    } catch (error) {
                        console.error(
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