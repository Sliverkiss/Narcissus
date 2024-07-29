module.exports = {
    name: '【威锋热搜】',
    execute: async (ctx) => {
        const headers = {
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
            'Referer':'https://www.feng.com/',
            'X-Request-Id':'qBBQ+qLs34td1bViO0hxnRPUwXUdT6/HwDHJtZIuXP9H7WHfRasE4G2+jysR3HavxomCh+S16Q81goatvyd2Sg=='
        }
        try {
            if (ctx.message && ctx.message.text.startsWith(',wfrs')) {
                let message = await ctx.reply("正在爬取中 . . .");
                const text = ctx.message.reply_to_message?.text || ctx.message.text.split(' ').slice(1).join(' ');
                const res = await fetch(`https://api.feng.com/v2/search/communitySynthesis?page=${text}&pageCount=30`, {headers});
                const jsonData = await res.json();
                try {
                    let responseText = '';
                    jsonData.data.dataList.forEach(i => {
                        if (i.newImages && i.newImages.length > 0) {
                            i.newImages.forEach(a => {
                                responseText += `ID: ${i.author}\n` + 
                                                `标题: ${i.subject}\n` + 
                                                `正文: ${i.content}\n` + 
                                                `图片: ${a.path}\n` + 
                                                `帖子URL: https://www.feng.com/post/13840244${i.tid}\n` + 
                                                `发帖时间: ${i.formatDateline}\n\n`;
                            });
                        }
                    });
                    if (responseText) {
                        await ctx.telegram.editMessageText(
                            message.chat.id,
                            message.message_id,
                            null,
                            responseText
                        );
                    } else {
                        await ctx.telegram.editMessageText(
                            message.chat.id,
                            message.message_id,
                            null,
                            "出错了呜呜呜 ~ 资源爬取失败。"
                        );
                    }
                } catch (e) {
                    await ctx.reply(`出错了呜呜呜 ~ API 服务器返回了错误。\n${jsonData.msg || ''}`);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
};
