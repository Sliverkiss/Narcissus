module.exports = {
    name: '【Hitokito】',
    execute: async (ctx) => {
        if (ctx.message && ctx.message.text === ',hitokito') {
            const hitokotoType = {
                a: "动画",
                b: "漫画",
                c: "游戏",
                d: "小说",
                e: "原创",
                f: "网络",
                g: "其他",
                h: "影视",
                i: "诗词",
                j: "网易云音乐",
                k: "哲学",
                l: "抖机灵"
            };
            let hitokotoJson = null;
            for (let i = 0; i < 10; i++) {
                try {
                    const response = await fetch('https://v1.hitokoto.cn/?charset=utf-8');
                    hitokotoJson = await response.json();
                    break;
                } catch (error) {
                    if (i === 9) {
                        ctx.reply('Failed to fetch data after multiple attempts.');
                        console.error(error);
                        return;
                    }
                }
            }

            if (!hitokotoJson) {
                return;
            }

            let add = '';
            if (hitokotoJson.from) {
                add += `《${hitokotoJson.from}》`;
            }
            if (hitokotoJson.type && hitokotoType[hitokotoJson.type]) {
                add += `（${hitokotoType[hitokotoJson.type]}）`;
            }
            if (hitokotoJson.from_who) {
                add += `${hitokotoJson.from_who}`;
            }

            ctx.reply(`${hitokotoJson.hitokoto} ${add}`);
        }
    }
};
