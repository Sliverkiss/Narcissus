module.exports = {
    name: '【舔狗日记】',
    execute: async (ctx) => {
        try{
            if (ctx.message && ctx.message.text === ',tiangou') {
                const response = await fetch(`https://api.52vmy.cn/api/wl/yan/tiangou`);
                const res = await response.json();
                if (res.code === 200) {
                    await ctx.reply(res.content);
                } else {
                    await ctx.reply(`出错了呜呜呜 ~ API 服务器返回了错误。\n${res.msg || ''}`);
                }
            }
        }catch(e){
            logger.error(e);
        }
    }
};