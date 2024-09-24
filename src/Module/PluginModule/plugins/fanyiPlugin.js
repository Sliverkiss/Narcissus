export default {
    name: '翻译',
    execute: async (ctx) => {
        try {
            if ($.command(ctx, ",fanyi")) {
                let text = ctx?.message?.reply_to_message?.text;
                const message = await getTranstale(text);
                await ctx.reply(`<pre>${message}</pre>`, { parse_mode: 'HTML' });
            }
        } catch (e) {
            ctx.reply(e, { parse_mode: 'HTML' })
            logger.error(e);
        }
    }
};


async function getTranstale(text) {
    const opts = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: $.toStr({
            "text": text,
            "source_lang": "auto",
            "target_lang": "ZH"
        })
    }
    let response = await fetch(`https://deeplx.missuo.ru/translate?key=iy21lmkF2kgYTu7vpO40T4GFsmpUkHVK1xdEKjTO4hs=`, opts);
    const res = await response.json();
    return res?.message || res?.data;
}