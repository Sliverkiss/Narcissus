export default {
    name: 'Start Plugin',
    promise: "personal",
    execute: (ctx) => {
        try {
            if ($.command(ctx, '/start')) {
                const userId = ctx?.message?.from?.id;
                const userName = ctx?.message?.from?.first_name;
                const caption = `☆　　╱╲*╱╲　☆\n ╱╳+▲╱　　╲　☆\n╱╱ ◢◣+　　╳╲ \n╱ +◢█◣　／　　╲☆\n☆　◢██◣   Sakura \n _▂▂█▂▂   Channel·2.0.0 \n<b>▎欢迎使用Funmika！${userName}</b>\n\n· 🆔 用户のID | ${userId}`
                ctx.reply(caption, {
                    parse_mode: 'HTML'
                });
            }
        } catch (e) {
            ctx.reply(e);
        }
    }
};