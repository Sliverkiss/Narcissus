module.exports = {
    name: '【查询Quantmult X脚本】',
    promise:"personal",
    execute: async (ctx) => {
        if (ctx?.message && ctx?.message?.text?.startsWith('/script')) {
            try {
                const keyWord = ctx?.message?.text?.split(' ').slice(1).join(' ');
                if (!keyWord) return await ctx.reply("⚠️ 请传入要查询的关键词~", { parse_mode: 'HTML' });
                let data = await getData();
                let res = extractData(data);
                //转换成小写后过滤
                let result = res?.filter(({ tagName }) => tagName?.toLowerCase().includes(keyWord.toLowerCase()))??[];
                if(!result||result?.length==0) return await ctx.reply("⚠️ 未查询到相关脚本~", { parse_mode: 'HTML' });
                //处理结果
                let message = result.map(e => `<a href="${e.jsLink}">[${e?.tagName}]</a>｜<a href="${e?.imgUrl}">[图标链接]</a>`).join("\n");
                await ctx.reply(message, { parse_mode: 'HTML' });
            } catch (e) {
                logger.error(e);
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
    const response = await fetch(`https://gist.githubusercontent.com/Sliverkiss/a7496bd073820942b44a9b36874aaf4c/raw/sliverkiss.gallery.json`);
    const data = await response.json();
    return data.task;
}