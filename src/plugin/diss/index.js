/*
!name=儒雅随和版祖安语录
!command=diss
!description=儒雅随和版祖安语录。
*/
function loadPlugin() {
    return {
        runScript
    }
}

async function runScript(bot, ctx, params) {
    try {
        let message = "";
        const dissMessage = await getDissMessage();
        if (dissMessage) {
            message=await ctx.reply(dissMessage);
        } else {
            message=await ctx.reply("出错了呜呜呜 ~ 试了好多好多次都无法访问到 API 服务器 。");
        }
    } catch (e) {
        message=await ctx.reply(`出错了呜呜呜 ~ ${e}`);
    }
    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, message.message_id), 2e4);
}

// 定义一个函数来发送diss消息
async function getDissMessage() {
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch('https://api.oddfar.com/yl/q.php?c=1009&encode=text');
            if (response.ok) {
                const text = await response.text();
                return text;
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
        }
    }
    return null;
}