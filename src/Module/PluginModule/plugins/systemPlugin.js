import os from 'os';

export default {
    name: '查询系统信息',
    execute: (ctx) => {
        try {
            if ($.command(ctx, ',system')) {
                let message = `<b>当前服务器信息如下：</b><pre>Operating System:${os.type()}\nPlatform:${os.platform()}\nArchitecture:${os.arch()}\nRelease:${os.release()}\nTotal Memory:${os.totalmem()}\nFree Memory:${os.freemem()}\nCPU Info:${os.cpus()}</pre>`
                ctx.reply(message, { parse_mode: 'HTML' });
            }
        } catch (e) {
            ctx.reply(e);
        }
    }
};