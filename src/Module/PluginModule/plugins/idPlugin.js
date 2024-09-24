export default {
    name: '查询用户id',
    promise: "personal",
    execute: (ctx) => {
        try {
            if ($.command(ctx, '/id')) {
                const userId = ctx?.message?.from?.id;
                const userName = ctx?.message?.from?.first_name;
                let message = `🆔 <code>${userId}</code>`
                ctx.reply(message, { parse_mode: 'HTML' });
            }
        } catch (e) {
            ctx.reply(e);
        }
    }
};