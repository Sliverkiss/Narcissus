export default  {
    name: '【聚合解析】',
    execute: async (ctx) => {
        try {
            if (ctx?.message && ctx?.message?.text?.startsWith(',jhjx')) {
                let message = await ctx.reply("🐱正在解析中 . . .");
                const text = ctx?.message?.reply_to_message?.text || ctx.message.text.split(' ').slice(1).join(' ');
                const re_Url = text.match(/https?:\/\/[^\s\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]+/g);
                const res = await fetch(`https://tenapi.cn/v2/video?url=${re_Url}`)
                const jsonData = await res.json()
                try {
                    const title = jsonData?.data?.title
                    const videoUrl = jsonData?.data?.url
                    if (title && videoUrl) {
                        let responseText = `title: ${title}\nvideoUrl: ${videoUrl}`
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
                            "出错了呜呜呜 ~ 🐱资源解析失败。"
                        );
                    }
                } catch (e) {
                    await ctx.reply(`出错了呜呜呜 ~ API 服务器返回了错误。\n${jsonData.msg || ''}`)
                }
            }
        } catch (e) {
            logger.error(e)
        }
    }
};
