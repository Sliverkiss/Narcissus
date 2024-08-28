export default {
    name: '【检测群组】',
    promise:"personal",
    execute: async (ctx) => {
        // 确保数据库表已创建
        await Chat.initialize();
        let chatList = await Chat.findAll();
        if (ctx?.message && (ctx?.chat?.type == 'group' || ctx?.chat?.type == 'supergroup')) {
            if (!chatList.find(c => c.id == ctx?.chat?.id)) {
                await Chat.createOrUpdate(ctx?.chat?.id, ctx?.chat?.title);
            }
        }
        if (ctx.message && ctx?.message?.text === '/group') {
            if (chatList.length === 0) {
                ctx.reply('Bot currently is not in any group.');
            } else {
                const groups = chatList.map((c, index) => `${index + 1}. ${c.chatName}`).join('\n');
                ctx.reply(`<b>Bot in the groups:</b>\n${groups}`, { parse_mode: 'HTML' });
            }
        }
    }
};

//记录群组
class Chat extends Sqlite {
  static tableName = 'chat';
  static fields = ['chatId', 'chatName'];
    static async findByChatId(chatId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE chatId = ?`;
    const rows = await this.query(sql, [chatId]);
    return rows[0];
  }
    
  static async createOrUpdate(chatId, chatName) {
    const existingMessage = await this.findByChatId(chatId);
    if (existingMessage) {
      return this.update(existingMessage.id, { chatName });
    } else {
      return this.create({ chatId, chatName });
    }
  }
}