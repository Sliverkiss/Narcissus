export default {
    name: '给作者打赏',
    promise: "personal",
    execute: async (ctx) => {
        if ($.command(ctx, "/thank")) {
            try {
                const stickerId = "CAACAgEAAxkBAAIXWmbfoEobFoqwohUGprXoNUYsxQ-GAAL_AQACZtNBRfe1IdfiixscNgQ"
                const message = '<code>0xc85d175450eb5d3F48e517A54d2c0094A45C5647</code>\n<pre>这是我的钱包地址。感谢赞助喵～你的支持，就是我更新的动力❤️</pre>';
                await ctx.reply(message, { parse_mode: 'HTML' });
                await ctx.telegram.sendSticker(ctx?.chat?.id, stickerId);
            } catch (e) {
                ctx.reply(e, { parse_mode: 'HTML' })
            }
        }
    }
};