export default  {
    name: '【查询Quantmult X脚本】',
    promise: "personal",
    execute: async (ctx) => {
        if (ctx?.message && ctx?.message?.text?.startsWith('/script')) {
            try {
                const keyWord = ctx?.message?.text?.split(' ').slice(1).join(' ');
                if (!keyWord) return await ctx.reply("⚠️ 请传入要查询的关键词~", { parse_mode: 'HTML' });
                let data = await getData();
                let res = extractData(data);
                //转换成小写后过滤
                let result = res?.filter(({ tagName }) => tagName?.toLowerCase().includes(keyWord.toLowerCase())) ?? [];
                if (!result || result?.length == 0) return await ctx.reply("⚠️ 未查询到相关脚本~", { parse_mode: 'HTML' });
                let hitokito = await getHitokito();
                let inlineKeyboard = result.map(e => [
                    { text: e?.tagName, url: e?.jsLink },
                    { text: "图标链接", url: e?.imgUrl }
                ]);
                await ctx.reply(hitokito, {
                    parse_mode: 'HTML', reply_markup: {
                        inline_keyboard: inlineKeyboard
                    }
                });
            } catch (e) {
                logger.error(e);
                ctx.reply(e);
            }
        }
    }
};


function extractData(arr) {
    const jsRegex = /https:\/\/[^\s,]+\.js/;
    const tagRegex = /tag=([^,]+)/;
    const imgUrlRegex = /img-url=([^,]+)/;

    return arr.flatMap(({ config }) => {
        const jsLink = jsRegex.exec(config)?.[0];
        const tagName = tagRegex.exec(config)?.[1];
        const imgUrl = imgUrlRegex.exec(config)?.[1];

        return jsLink || tagName || imgUrl ? [{ jsLink, tagName, imgUrl }] : [];
    });
}

async function getData() {
    const response = await fetch(`https://github.mimic.us.kg/Sliverkiss/waf/main/sliverkiss.gallery.json`);
    const data = await response.json();
    return data.task;
}

async function getHitokito() {
    try {
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
                    console.error(error);
                    return 'Failed to fetch data after multiple attempts.'
                }
            }
        }

        if (!hitokotoJson) {
            return 'Failed to fetch data after multiple attempts.';
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
        return `${hitokotoJson.hitokoto} ${add}`;
    } catch (e) {
        logger.error(e);
        return 'Failed to fetch data after multiple attempts.';
    }
}
