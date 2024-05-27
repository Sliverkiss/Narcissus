/*
!name=bot可用性检测
!command=status
!description=检测bot在该群组是否可用
*/
function loadPlugin() {
    return {
        runScript: async (bot, ctx, params) => {
            let sendMessage = await ctx.reply(`<b>Mitsuko Funmika</b>竭诚为您服务！${params}`, {
                reply_to_message_id: ctx.message.message_id,
                parse_mode: 'HTML'
            });
            setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 3e3);
        },
        show: async (bot, ctx, params) => {
            let sendMessage = await ctx.reply(`展示`, {
                reply_to_message_id: ctx.message.message_id,
                parse_mode: 'HTML'
            });
            setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 3e3);
        },
    }
}
