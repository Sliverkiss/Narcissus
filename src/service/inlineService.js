

async function inLine(bot) {
    bot.on('inline_query', async (ctx) => {
        const query = ctx.inlineQuery.query;

        // 检查用户是否输入了查询内容
        if (!query) {
            // 用户未输入查询内容时，返回帮助菜单
            const helpText = `
            Speedtest Bot 帮助菜单：
            
            使用方法:
            输入关键字进行搜索，获取相关信息。
    
            示例:
            输入 "测速" 进行网络速度测试。
            输入 "附近测速点" 获取附近的测速点列表。
            `;

            const results = [
                {
                    type: 'article',
                    id: '1',
                    title: '帮助菜单',
                    input_message_content: {
                        message_text: helpText,
                        parse_mode: 'Markdown'
                    },
                    description: '点击以查看帮助菜单'
                }
            ];

            // 发送帮助菜单
            try {
                await ctx.answerInlineQuery(results);
            } catch (error) {
                console.error('Error answering inline query:', error);
            }
        } else {
            // 用户输入了查询内容，根据内容返回相关结果
            const results = [
                {
                    type: 'article',
                    id: '1',
                    title: `Result for "${query}"`,
                    input_message_content: {
                        message_text: `You searched for "${query}"`
                    },
                    description: `${query}`
                }
            ];

            // 发送结果
            try {
                await ctx.answerInlineQuery(results);
            } catch (error) {
                console.error('Error answering inline query:', error);
            }
        }
    });
}

module.exports = { inLine }