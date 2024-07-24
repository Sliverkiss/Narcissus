require('dotenv').config();

const config={
    botToken: process.env.BOT_TOKEN || '7097873325:AAGvD5ctMZ_CiRzIGJZLh9RV7LMgCRSHEzo',
    dbPath: process.env.DB_PATH || 'bot.sqlite',
    adminId: process.env.ADMIN_ID || '5232284790'
};

//全局属性
global.config=config
module.exports = config