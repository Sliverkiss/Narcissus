(await import('dotenv')).config();

export const CONFIG={
    botToken: process.env.BOT_TOKEN || '7097873325:AAGvD5ctMZ_CiRzIGJZLh9RV7LMgCRSHEzo',
    dbPath: process.env.DB_PATH || 'bot.sqlite',
    adminId: process.env.ADMIN_ID || '5232284790'
};