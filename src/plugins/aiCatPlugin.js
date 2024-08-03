module.exports = {
    name: '【猫娘AI】',
    promise: "personal",
    execute: async (ctx) => {
        try {
            //自动回复功能
            if (isAutoReply(ctx)) {
                const text = ctx?.message?.text
                try {
                    const response = await fetch(`https://api.mhimg.cn/api/gpt_aimaoniang/?prompt=${encodeURIComponent(text)}`);
                    const responseText = await response.text();
                    logger.info(`ai自动回复：${responseText}`);
                    await ctx.reply(responseText);
                } catch (error) {
                    logger.error(error.toString());
                }
                return;
            }
            //指令问答功能
            if (isCommand(ctx)) {
                const text = ctx?.message?.reply_to_message?.text || ctx?.message?.text?.split(' ').slice(1).join(' ');
                let message = await ctx.reply("🐱正在思考中 . . .");
                logger.info(text);
                try {
                    const response = await fetch(`https://api.mhimg.cn/api/gpt_aimaoniang/?prompt=${encodeURIComponent(text)}`);
                    const responseText = await response.text();
                    logger.info(`ai自动回复：${responseText}`);
                    await ctx.telegram.editMessageText(
                        message.chat.id,
                        message.message_id,
                        null,
                        responseText
                    );
                } catch (error) {
                    await ctx.telegram.editMessageText(
                        message.chat.id,
                        message.message_id,
                        null,
                        error.toString()
                    );
                }
            }
        } catch (e) {
            logger.error(e);
        }

    }
};

function isAutoReply(ctx) {
    return ctx?.message && ctx?.chat?.type != 'private' && ctx?.message?.reply_to_message?.from?.id == '7097873325'
}

function isCommand(ctx) {
    return ctx?.message && ctx?.message?.text?.startsWith(',cat');
}