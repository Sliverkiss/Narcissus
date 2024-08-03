const cheerio = require('cheerio');

module.exports = {
    name: '【小火箭账号共享】',
   	promise:"personal",
    execute: async (ctx) => {
        if (ctx?.message && ctx?.message?.text === ',shadow') {
            let accounts = await getAccounts();
            let message = [];
            accounts.map(e => {
                message.push(`${getFlagEmoji(e.location)}｜⏰ ${e.lastCheck.split(" ")[1]} -> ${e.status?.match(/正常/) ? "✅" : "⚠️"}\n<pre>${e.username}\n${e.password}</pre>\n`);
            })
            message = `<b> Shadowrocket账号共享</b>\n\n${message.join("\n")}`
            message += `\n#小火箭共享 #shadowrocket`;
            await ctx.reply(message, { parse_mode: 'HTML' });
        }
    }
};

async function getAccounts() {
    // shareapi
    const shareList = [
        'https://id.idunlock.cfd/shareapi/yBFJNnWjso',
        'https://id.idunlock.cfd/shareapi/PyuZoYOzpd',
        'https://id.idunlock.cfd/shareapi/mOvExPtksh',
        'https://id.idunlock.cfd/shareapi/UidJsNGxAr',
        'https://id.idunlock.cfd/shareapi/qrsnaxXiRU',
    ];

    // 使用 Promise.all 来并发请求
    const promises = shareList.map(url => getIDByShareApi(url));
    let result = []
    try {
        let res = await Promise.all(promises);
        res?.map(e => result.push(...e));
    } catch (e) {
        logger.error(e);
    }
    return result;
}


//shareapi类型
async function getIDByShareApi(url) {
    try {
        const opts = {
            headers: {
                'Accept-Encoding': `gzip, deflate, br`,
                'Sec-Fetch-Mode': `navigate`,
                'Connection': `keep-alive`,
                'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
                'Referer': `https://id.ozc.me/`,
                'Host': `id.idunlock.cfd`,
                'User-Agent': `Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/111.0.5563.101 Mobile/15E148 Safari/604.1`,
                'Sec-Fetch-Site': `cross-site`,
                'Sec-Fetch-Dest': `iframe`,
                'Accept-Language': `zh-CN,zh-Hans;q=0.9`
            }
        }
        // Fetch the content from the URL
        const response = await fetch(url, opts);
        // Get the text content of the response
        const data = await response.json();
        let result = [];
        data?.accounts.map(e => {
            result.push({
                location: e.region,
                lastCheck: e.last_check,
                status: e.message,
                username: e.username,
                password: e.password
            })
        })
        return result;
    } catch (e) {
        logger.error(e);
    }
}


//爬虫网页类型
async function getShadowRocketId() {
    try {
        const opts = {
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Sec-Fetch-Mode': 'navigate',
                'Connection': 'keep-alive',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Referer': 'https://shenhouyun.com/',
                'Host': 'pgid.fx88888888.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Dest': 'iframe',
                'Accept-Language': 'zh-CN,zh-Hans;q=0.9'
            }
        };
        // Fetch the content from the URL
        const response = await fetch("https://pgid.fx88888888.com/share/8888888ff/", opts);

        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }

        // Get the text content of the response
        const html = await response.text();

        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Extract and return the necessary information
        const cards = $('.card');
        const results = [];

        cards.each((index, card) => {
            const location = $(card).find('span.badge.bg-indigo').text().trim();
            const lastCheck = $(card).find('p.card-subtitle:contains("上次检查")').text().trim().replace('上次检查: ', '');
            const status = $(card).find('p.card-subtitle:contains("状态") span.badge').text().trim();

            const usernameButton = $(card).find('button[id^="username_"]');
            const passwordButton = $(card).find('button[id^="password_"]');

            const username = usernameButton.attr('data-clipboard-text').trim();
            const password = passwordButton.attr('data-clipboard-text').trim();

            results.push({
                location,
                lastCheck,
                status,
                username,
                password
            });
        });

        return results;

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return [];
    }
}
//获取国家对应国旗
function getFlagEmoji(A) { const t = { "阿富汗": "AF", "阿尔巴尼亚": "AL", "阿尔及利亚": "DZ", "安道尔": "AD", "安哥拉": "AO", "阿根廷": "AR", "亚美尼亚": "AM", "澳大利亚": "AU", "奥地利": "AT", "阿塞拜疆": "AZ", "中国": "CN", "美国": "US", "英国": "GB", "法国": "FR", "德国": "DE", "日本": "JP", "韩国": "KR", "巴西": "BR", "印度": "IN", "加拿大": "CA", "墨西哥": "MX", "意大利": "IT", "西班牙": "ES", "俄罗斯": "RU", "南非": "ZA", "沙特阿拉伯": "SA", "土耳其": "TR", "荷兰": "NL", "瑞士": "CH", "瑞典": "SE", "挪威": "NO", "芬兰": "FI", "丹麦": "DK", "希腊": "GR", "葡萄牙": "PT", "比利时": "BE", "波兰": "PL", "捷克": "CZ", "匈牙利": "HU", "罗马尼亚": "RO", "保加利亚": "BG", "乌克兰": "UA", "新西兰": "NZ", "马来西亚": "MY", "新加坡": "SG", "泰国": "TH", "越南": "VN", "菲律宾": "PH", "印度尼西亚": "ID", "以色列": "IL", "埃及": "EG", "阿联酋": "AE", "卡塔尔": "QA", "香港": "HK" }[A]; if (!t) return "找不到对应的国家或地区"; return t.toUpperCase().split("").map((A => String.fromCodePoint(127397 + A.charCodeAt()))).join("") }
