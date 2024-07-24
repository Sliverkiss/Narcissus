module.exports = {
    name: '【查询机场订阅】',
    execute: async (ctx) => {
        if (ctx.message && ctx.message.text === ',cha') {
            const messageRaw = ctx.message.reply_to_message
                ? (ctx.message.reply_to_message.caption || ctx.message.reply_to_message.text)
                : (ctx.message.caption || ctx.message.text);

            const urlList = messageRaw.match(/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g);
            if (!urlList) {
                return ctx.reply('未找到订阅链接');
            }

            let finalOutput = '';

            for (const url of urlList) {
                try {
                    const res = await fetch(url, { headers: { 'User-Agent': 'ClashforWindows/0.18.1' }, timeout: 5000 });
                    if (res.status === 301 || res.status === 302) {
                        const url1 = res.headers.get('location');
                        res = await fetch(url1, { headers: { 'User-Agent': 'ClashforWindows/0.18.1' }, timeout: 5000 });
                    }
                    if (res.status === 200) {
                        try {
                            const info = res.headers.get('subscription-userinfo');
                            const infoNum = info.match(/\d+/g);
                            const timeNow = Math.floor(Date.now() / 1000);
                            const airportName = await getFilenameFromUrl(url);

                            const outputTextHead = `🎬订阅链接：\`${url}\`\n📇机场名：\`${airportName}\`\n⬆️已用上行：\`${strOfSize(parseInt(infoNum[0]))}\`\n⬇️已用下行：\`${strOfSize(parseInt(infoNum[1]))}\`\n♻️剩余：\`${strOfSize(parseInt(infoNum[2]) - parseInt(infoNum[1]) - parseInt(infoNum[0]))}\`\n🤦总共：\`${strOfSize(parseInt(infoNum[2]))}`;

                            let outputText;
                            if (infoNum.length >= 4) {
                                const expireTime = parseInt(infoNum[3]) + 28800;
                                const expireDate = new Date(expireTime * 1000).toISOString().split('T')[0];
                                if (timeNow <= expireTime) {
                                    const lastTime = expireTime - timeNow;
                                    outputText = `${outputTextHead}\n🥹到期\`${expireDate}\`   🔜   \`${secToData(lastTime)}\``;
                                } else {
                                    outputText = `${outputTextHead}\n此订阅已于\`${expireDate}\`过期！`;
                                }
                            } else {
                                outputText = `${outputTextHead}\n到期时间：\`未知\``;
                            }
                            finalOutput += `${outputText}\n\n`;
                        } catch {
                            finalOutput += `订阅链接：\`${url}\`\n机场名：\`${await getFilenameFromUrl(url)}\`\n无流量信息\n\n`;
                        }
                    } else {
                        finalOutput += '无法访问\n\n';
                    }
                } catch {
                    finalOutput += '连接错误\n\n';
                }
            }

            ctx.reply(finalOutput);
        }
    }
};

async function getFilenameFromUrl(url) {
    if (url.includes("sub?target=")) {
        const pattern = /url=([^&]*)/;
        const match = url.match(pattern);
        if (match) {
            const encodedUrl = match[1];
            const decodedUrl = decodeURIComponent(encodedUrl);
            return getFilenameFromUrl(decodedUrl);
        }
    } else if (url.includes("api/v1/client/subscribe?token")) {
        if (!url.includes("&flag=clash")) {
            url += "&flag=clash";
        }
        try {
            const response = await fetch(url);
            const header = response.headers.get('content-disposition');
            if (header) {
                const pattern = /filename\*=UTF-8''(.+)/;
                const result = header.match(pattern);
                if (result) {
                    let filename = result[1];
                    filename = decodeURIComponent(filename);
                    const airportName = filename.replace(/%20/g, " ").replace(/%2B/g, "+");
                    return airportName;
                }
            }
        } catch {
            return '未知';
        }
    } else {
        try {
            const baseUrlMatch = url.match(/(https?:\/\/[^/]+)/);
            const baseUrl = baseUrlMatch ? baseUrlMatch[1] : null;
            const response = await fetch(baseUrl + '/auth/login', { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (response.status !== 200) {
                const response = await fetch(baseUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            }
            const html = await response.text();
            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            let title = titleMatch ? titleMatch[1] : '未知';
            title = title.replace('登录 -- ', '');
            if (title.includes("Attention Required! | Cloudflare")) {
                title = '该域名仅限国内IP访问';
            } else if (title.includes("Access denied") || title.includes("404 Not Found")) {
                title = '该域名非机场面板域名';
            } else if (title.includes("Just a moment")) {
                title = '该域名开启了5s盾';
            }
            return title;
        } catch {
            return '未知';
        }
    }
}

function convertTimeToStr(ts) {
    return ts.toString().padStart(2, '0');
}

function secToData(y) {
    const h = convertTimeToStr(Math.floor(y / 3600 % 24));
    const d = convertTimeToStr(Math.floor(y / 86400));
    return `${d}天${h}小时`;
}

function strOfSize(size) {
    function strofsize(integer, remainder, level) {
        if (integer >= 1024) {
            remainder = integer % 1024;
            integer = Math.floor(integer / 1024);
            level += 1;
            return strofsize(integer, remainder, level);
        } else if (integer < 0) {
            integer = 0;
            return strofsize(integer, remainder, level);
        } else {
            return [integer, remainder, level];
        }
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let [integer, remainder, level] = strofsize(size, 0, 0);
    if (level + 1 > units.length) level = units.length - 1;
    return `${integer}.${remainder.toString().padStart(3, '0')} ${units[level]}`;
}
