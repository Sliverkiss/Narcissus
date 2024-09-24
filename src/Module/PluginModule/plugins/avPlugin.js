import * as cheerio from 'cheerio';

export default {
    name: '番号查询',
    promise: "personal",
    execute: async (ctx) => {
        if ($.command(ctx, "/av")) {
            // 发送初始消息
            let message = await ctx.reply('🐱正在查找中...');
            try {
                // 假设从用户消息中提取到的番号代码
                let code = ctx?.message?.text?.split(' ').slice(1).join(' ') || ctx?.message?.reply_to_message?.text;
                code = code.trim().toUpperCase();
                console.log(`当前需要查找的番号: ${code}`);

                // 创建JavDB实例并查询信息
                const javdb = new JavDB(code);
                const movie = await javdb.main();
                if (movie) {
                    //番号和介绍
                    const { id, description } = extractInfo(movie?.title);
                    //评分
                    let score = generateRating(movie?.score);
                    const caption = `<b>${id} / ${movie?.meta} /<a href="${movie.thumb}"> </a><a href="https://missav.com/${code}">在线观看</a></b>\n${score}\n<a href="https://t.me/jisou2bot?start=a_5232284790">Search code & Watch 🔍</a>\n<pre>${description}</pre>`;
                    await ctx.telegram.editMessageText(
                        message.chat.id,
                        message.message_id,
                        null,
                        caption, { parse_mode: 'HTML' }
                    );
                } else {
                    // 修改消息，告知番号未找到
                    await ctx.telegram.editMessageText(
                        ctx.chat.id,
                        message.message_id,
                        null,
                        '未找到相关番号，请重试。'
                    );
                }
            } catch (error) {
                logger.error(error);
                // 发送错误消息
                await ctx.telegram.editMessageText(
                    ctx.chat.id,
                    message.message_id,
                    null,
                    '查询时出错，请稍后重试。'
                );
            }
        }
    }
};

function generateRating(text) {
    // 正则表达式提取分数（例如 4.36）
    const scoreMatch = text.match(/(\d+(\.\d+)?)分/);
    if (!scoreMatch) {
        return "无效的评分格式";
    }

    // 解析分数
    const score = parseFloat(scoreMatch[1]);

    // 确保分数在0到5之间
    if (score < 0) score = 0;
    if (score > 5) score = 5;

    // 计算完整星星数量和半星数量
    const fullStars = Math.floor(score);  // 整星数量
    const halfStar = score % 1 >= 0.5 ? 1 : 0;  // 判断是否需要半星
    const emptyStars = 5 - fullStars - halfStar;  // 计算空星数量

    // 构造评分字符串
    const rating = '★'.repeat(fullStars) + '☆'.repeat(emptyStars) + (halfStar ? '★' : '☆').slice(0, halfStar);

    // 返回评分和分数
    return `${rating} ${score.toFixed(2)}分`;
}

function extractInfo(text) {
    // 正则表达式匹配番号（例如：CLUB-456），不限制字母和数字的数量
    const idRegex = /[A-Z]+-\d+/;
    // 正则表达式匹配番号后的介绍
    const descriptionRegex = /([A-Z]+-\d+)\s+(.+)/;

    // 提取番号
    const idMatch = text.match(idRegex);
    const id = idMatch ? idMatch[0] : null;

    // 提取介绍
    const descriptionMatch = text.match(descriptionRegex);
    const description = descriptionMatch ? descriptionMatch[2] : null;

    return {
        id: id,
        description: description
    };
}

class JavDB {
    constructor(code = '') {
        this.code = code.toUpperCase()
        this.baseURL = 'https://javdb.com';
    }

    async search() {
        const res = await fetch(`https://javdb.com/search?q=${this.code}&f=all`, {
            method: 'GET',
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'zh-CN,zh;q=0.9'
            }
        })
        const data = await res.text()
        const $ = cheerio.load(data)
        const $list = $('.movie-list')
        this.list = $list
            .find('.item')
            .toArray()
            .map((item) => {
                const $a = $(item).find('a')
                return {
                    code: /([A-Za-z]+-\d+)/.exec($a.find('.video-title').text()?.trim())?.[1]?.replace(/\s+/g, '')?.toUpperCase(),
                    link: this.baseURL + $a.attr('href'),
                    title: $a.find('.video-title').text()?.trim(),
                    thumb: $a.find('.cover img').attr('src'),
                    score: $a.find('.score span.value').text()?.trim(),
                    meta: $a.find('.meta').text()?.trim(),
                    hasMagnet: !!$a.find('.tags').text()?.replace(/\s+/g, '')
                }
            })
    }

    async getMagnet(url) {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'zh-CN,zh;q=0.9'
            }
        })
        const data = await res.text()
        const $ = cheerio.load(data)
        const magnet = $('#magnets-content .item')
            .toArray()
            .map((item) => {
                const $item = $(item)
                const $a = $item.find('.magnet-name > a')
                return {
                    link: this.baseURL + $a.attr('href'),
                    name: $a.find('.name').text()?.trim(),
                    size: $a.find('.meta').text()?.trim(),
                    tag: $a.find('.tags .tag').text()?.trim(),
                    date: $item.find('.date .time').text()?.trim()
                }
            })
        return magnet
    }

    async main() {
        await this.search()
        const item = this.list.find((item) => item.code === this.code)
        console.log(item)
        if (item?.hasMagnet) {
            const magnet = await this.getMagnet(item.link)
            Object.assign(item, { magnet })
        }
        return item
    }
}