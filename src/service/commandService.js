const utils = require('../utils');


async function loadCommand(bot) {
    // 定义 command 目录路径
    let directories = utils.getAllCommand();
    directories.map(dir => {
        bot.command(dir, (ctx) => {
            try {
                const scriptContent = utils.getCommand(dir);
                eval(scriptContent);
                console.log(`触发指令:${dir}`);
                runScript(ctx);

            } catch (error) {
                console.log(`⚠️ 运行 ${dir}/命令出错: ${error}`);
                ctx.reply(`⚠️ 运行 ${dir}/命令出错: ${error}`);
            }
        });
    });
}

module.exports = { loadCommand };