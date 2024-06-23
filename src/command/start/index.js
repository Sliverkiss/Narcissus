/*
!command=start
!content=开始
*/
async function runScript(ctx) {
    const message = `<b>Mitsuko Funmika竭诚为您服务！</b>\n\n指令列表：/help\n开发文档：<a href="https://github.com/Sliverkiss/Narcissus">链接</a>\n\n个人频道：@sliverkiss_blog\n讨论群组：<a href="https://t.me/+LcoDyCt7bskzNTZh">✿ さくらにわ</a>\n联系作者：向本bot发送信息即可\n`
    const replyMessage = await ctx.reply(message, {
        reply_to_message_id: ctx.message.message_id,
        disable_web_page_preview: true,
        parse_mode: 'HTML'
    });
    let replyMessageId = replyMessage.message_id;
    //20秒后删除消息
    setTimeout(() => {
        ctx.telegram.deleteMessage(ctx.chat.id, replyMessageId);
    }, 5e4);
}