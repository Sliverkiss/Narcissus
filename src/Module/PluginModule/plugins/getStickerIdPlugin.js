export default {
    name: '获取表情文件id',
    promise: "personal",
    execute: (ctx) => {
        try {
            if ($.command(ctx, ",sticker_id")) {
                const stickerId = ctx?.message?.reply_to_message?.sticker?.file_id;
                const message = `<code>${stickerId}</code>`;
                ctx.reply(message, { parse_mode: 'HTML' });
            }
        } catch (e) {
            ctx.reply(e, { parse_mode: 'HTML' });
        }
    }
};