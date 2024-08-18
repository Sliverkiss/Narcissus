const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'apt Plugin',
    execute: async (ctx) => {
        if (ctx?.message && ctx?.message?.text?.startsWith(',apt install')) {
            try {
                let pluginName = "";
                let pluginContent = "";

                const message = ctx?.message?.reply_to_message;
                //检查回复的消息中是否包含文件
                if (message?.document) {
                    // 获取文件信息
                    const file = message.document;
                    const fileId = file.file_id;
                    const fileName = file.file_name;
                    if (!fileName?.match(/\.js/)) throw new Error("插件格式错误");
                    // 下载文件
                    const fileLink = await ctx.telegram.getFileLink(fileId);
                    const response = await fetch(fileLink.href);
                    pluginContent = await response.text();
                    //提取插件名称
                    pluginName = fileName.replace(/\.js$/, '');
                } else {
                    await ctx.reply(`⚠️请在需要安装的插件下回复该指令～`);
                }
                if (addPlugin(pluginName, pluginContent)) {
                    await ctx.reply(`安装 ${pluginName} 插件成功喵～`);
                }
            } catch (e) {
                logger.error('Error installing file:', e);
                // 通知删除信息
                await ctx.reply(`安装插件时出错：${error}`);
            }
        }
    }
};

/**
 * 安装插件
 * @param {string} pluginName - 插件名称
 * @param {string} fileContent - 文件内容
 * @returns {boolean} - 是否安装成功
 */
function addPlugin(pluginName, fileContent) {
    try {
        // 获取项目根目录
        const rootDir = path.resolve(__dirname, '..');
        // 构建子目录的绝对路径
        const pluginDir = path.join(rootDir, 'plugins', `${pluginName}.js`);
        try {
            // 写入文件内容
            fs.writeFileSync(pluginDir, fileContent);
            console.log(`数据已写入到 ${indexPath}`);
            return true;
        } catch (error) {
            console.error(`写入文件时出错: ${error.message}`);
        }
    } catch (error) {
        return null;
    }
}
