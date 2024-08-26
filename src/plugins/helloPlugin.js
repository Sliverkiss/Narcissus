export default {
    name: 'Start Plugin',
    promise: "personal",
    execute: (ctx) => {
        try {
            if ($.command(ctx, '/start')) {
                const userId = ctx?.message?.from?.id;
                const userName = ctx?.message?.from?.first_name;
                const caption = `☆　　╱╲*╱╲　☆\n ╱╳+▲╱　　╲　☆\n╱╱ ◢◣+　　╳╲ \n╱ +◢█◣　／　　╲☆\n☆　◢██◣   Sakura \n _▂▂█▂▂   Channel·2.0.0 \n▎欢迎使用Funmika！${userName}\n\n· 🆔 用户のID | ${userId}`;
                const result = [
                    [
                        { text: "Github主页", url: "https://github.com/Sliverkiss" },
                        { text: "Telegram频道", url: "https://t.me/sliverkiss_blog" }
                    ],
                    [{ text: "Give me a coffee☕️", url: "https://raw.githubusercontent.com/Sliverkiss/QuantumultX/main/icon/IMG_3486.jpeg" }]
                ]
                ctx.reply(caption, {
                    parse_mode: 'HTML', reply_markup: {
                        inline_keyboard: result
                    }
                });
            }
        } catch (e) {
            ctx.reply(e);
        }
    }
};