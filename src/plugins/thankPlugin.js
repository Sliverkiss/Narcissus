module.exports = {
    name: '给作者打赏',
    promise: "personal",
    execute: (ctx) => {
        if (ctx?.message && ctx?.message.text === '/thank') {
            const imageUrl = 'https://raw.githubusercontent.com/Sliverkiss/QuantumultX/main/icon/IMG_3486.jpeg';
            const caption = '<b>感谢打赏喵～</b>\n\n你的支持，就是我更新的动力';
            ctx.replyWithPhoto(
                { url: imageUrl },
                {
                    caption: caption,
                    parse_mode: 'HTML'
                }
            );
        }
    }
};