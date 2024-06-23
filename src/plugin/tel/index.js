/*
!name=查询手机号码归属地等信息
!command=tel
!description=查询电话号码归属地，号码段，卡类型，运营商及通信标准。
*/
function loadPlugin() {
    return {
        runScript
    }
}
async function runScript(bot, ctx, params) {
    const phone = ctx.message.text.split(' ')[1];
    if (!phone || !/^\d+$/.test(phone)) {
        return ctx.reply("出错了呜呜呜 ~ 无效的参数。");
    }
    let message = await ctx.reply("获取中 . . .");

    try {
        const response = await fetch(`https://tenapi.cn/v2/phone?tel=${phone}`, {
            method: 'POST'
        });

        const res = await response.json();

        if (res.code === 200) {
            const data = res.data;
            await ctx.telegram.editMessageText(
                message.chat.id,
                message.message_id,
                null,
                `查询目标: ${phone}\n地区: ${data.local}\n号段: ${data.num}\n卡类型: ${data.type}\n运营商: ${data.isp}\n通信标准: ${data.std}`
            );
        } else {
            await ctx.telegram.editMessageText(
                message.chat.id,
                message.message_id,
                null,
                `出错了呜呜呜 ~ API 服务器返回了错误。\n${res.msg || ''}`
            );
        }
    } catch (error) {
        await ctx.telegram.editMessageText(
            message.chat.id,
            message.message_id,
            null,
            "出错了呜呜呜 ~ API 服务器返回了错误。"
        );
    }
    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, message.message_id), 2e4);
}


