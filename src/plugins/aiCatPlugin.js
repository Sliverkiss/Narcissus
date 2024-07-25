
module.exports = {
    name: '【猫娘AI】',
    promise:'personal',
    execute: async (ctx) => {
        if (ctx.message && ctx?.message?.text?.startsWith(',cat')) {
            const text =ctx?.message?.text?.split(' ').slice(1).join(' ')||ctx?.message?.reply_to_message?.text;
            let message = await ctx.reply("🐱正在思考中 . . .");
            try {
                const response = await fetch(`https://api.mhimg.cn/api/gpt_aimaoniang/?prompt=${encodeURIComponent(text)}`);
                const responseText = await response.text();
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
    }
};