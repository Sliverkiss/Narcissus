

function loadPlugin() {
    return {
        runScript
    }
}

async function runScript(bot, ctx, params) {
    let accounts = await getIDByUrl();
    let message = [];
    let title = ['正在检测', '此ID状态正常', '此ID状态异常，请联系客服更换', '检测修复中，大约30-60秒'];
    accounts.map(e => {
        message.push(`账号状态：${title[e.status]}\n检测时间：${e.time}\n帐号信息：${e.username}\n密码内容：${e.password}\n`);
    })
    message = ` Shadowrocket账号共享\n\n${message.join("\n")}`
    message+=`\n#小火箭共享 #shadowrocket`
    let sendMessage = await ctx.reply(message, {
        reply_to_message_id: ctx.message.message_id
    });
    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, sendMessage.message_id), 6e5);
}

async function getIDByUrl() {
    const urls = [
        'https://apple.laogoubi.net/p/ad294e736608aefa7b503d2c2f8d81af',
        'https://apple.laogoubi.net/p/bedef284c7f8f82615bb9bb52db2bbb4',
        'https://apple.laogoubi.net/p/c5c848fc95220e4d03084bb2d93c35ca',
        'https://apple.laogoubi.net/p/c5c848fc95220e4d03084bb2d93c35ca',
        'https://apple.laogoubi.net/p/40ec844bd7593c44e7042d6c9f95306c',
        'https://apple.laogoubi.net/p/39244056192a2ff726befdc13830e8c0',
        'https://apple.laogoubi.net/p/89639fa348a9b1a2836e81b369b0bb92',
        'https://apple.laogoubi.net/p/4e66836f2b10b15285a141a226a78bce',
        'https://apple.laogoubi.net/p/4d8d4f47edad7f4301cdfe646c378e92',
        'https://apple.laogoubi.net/s/2792b9ed836eca1111823b2bd0930647',
        'https://apple.laogoubi.net/p/f27e04f3c4a411a751319837b4571fa2',
        'https://apple.laogoubi.net/s/c7d1e73290a646f2513f6f0b75843b0b',
        'https://apple.laogoubi.net/p/3498864b521434c33fb0cfb612a1f56c',
        'https://apple.laogoubi.net/p/85b1d95fbdcc719c87f0f694d0be11b4',
        'https://apple.laogoubi.net/p/1a6aab6fb7a5687be3b970e8e16634bf',
        'https://apple.laogoubi.net/p/441cbf5a478534e747c3e32d2dd58de6',
        'https://apple.laogoubi.net/p/cd998bda330fbb0ebf721280d003a455'
    ]
    let results = await Promise.all(urls.map(e => getID(e)));
    results = results.filter(e => e?.[0]?.status == 1).map(e => e[0]);
    return results;
}

async function getID(e) {
    try {
        const res = await fetch(e, {
            headers: {
                'Accept': `application/json, text/javascript, */*; q=0.01`,
                'Accept-Encoding': `gzip, deflate, br`,
                'Connection': `keep-alive`,
                'Sec-Fetch-Mode': `cors`,
                'Host': `apple.laogoubi.net`,
                'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15`,
                'Sec-Fetch-Site': `same-origin`,
                'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
                'Sec-Fetch-Dest': `empty`,
                'X-Requested-With': `XMLHttpRequest`
            }
        }).then(res => res.json());
        return res;
    } catch (e) {
        console.log(e);
    }
}


function removeHyphensFromDate(dateString) {
    // 创建一个 Date 对象
    const date = new Date(dateString);

    // 提取年、月、日、时、分、秒
    const year = date.getFullYear() + "年";
    const month = (date.getMonth() + 1) + "月"; // 月份从 0 开始，需要加 1
    const day = date.getDate() + "日";
    const hours = date.getHours().toString().padStart(2, '0') + "时";
    const minutes = date.getMinutes().toString().padStart(2, '0') + "分";
    const seconds = date.getSeconds().toString().padStart(2, '0') + "秒";

    // 返回格式化后的时间字符串
    return `${year}${month}${day} ${hours}:${minutes}:${seconds}`;
}