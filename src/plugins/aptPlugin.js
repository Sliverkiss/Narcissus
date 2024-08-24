import * as path from 'node:path';
import * as fs from 'node:fs';

export default {
    name: 'apt Plugin',
    execute: async (ctx) => {
        try {
            if (!$.command(ctx, ',apt')) return;
            //移除插件
            if ($.command(ctx, ",apt remove")) {
                const [, , pluginName] = ctx?.message?.text?.split(" ");
                if (!pluginName) return await ctx.reply("请传入移除插件名称");
                return await deletePlugin(ctx,pluginName);
            }
            if ($.command(ctx, ",apt install")) {
                const message = ctx?.message?.reply_to_message;
                if (!message?.document) return await ctx.reply("⚠️请在需要安装的插件下回复该指令～");
                // 获取文件信息
                const file = message.document;
                const fileId = file.file_id;
                const fileName = file.file_name;
                if (!fileName?.match(/\.js/)) throw new Error("插件格式错误");
                // 下载文件
                const fileLink = await ctx.telegram.getFileLink(fileId);
                const response = await fetch(fileLink.href);
                let pluginContent = await response.text();
                //提取插件名称
                let pluginName = fileName.replace(/\.js$/, '');
                return await addPlugin(ctx,pluginName, pluginContent);
            }
            await ctx.reply(',apt install\t直接回复文件\n ,apt remove [插件名]');
        } catch (e) {
            logger.error(e);
        }
    }
};

/**
 * 安装插件
 * @param {string} pluginName - 插件名称
 * @param {string} fileContent - 文件内容
 * @returns {boolean} - 是否安装成功
 */
async function addPlugin(ctx,pluginName, fileContent) {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建子目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugins', `${pluginName}.js`);

    try {
        // 写入文件内容
        fs.writeFileSync(pluginDir, fileContent);
        logger.info(`数据已写入到 ${pluginDir}`);
        await ctx.reply(`添加${pluginName}插件成功喵～`);
    } catch (error) {
        logger.error(`写入文件时出错: ${error.message}`);
        await ctx.reply(`添加插件失败！${error}`);
    }
}

/**
 * 移除插件
 * @param {string} pluginName - 插件名称
 * @returns {string} - 文件内容
 */
async function deletePlugin(ctx,pluginName) {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建子目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugins', `${pluginName}.js`);
    try {
        // 删除目录及其所有文件
        fs.unlinkSync(pluginDir, { recursive: true });
        logger.info(`成功移除插件 ${pluginDir}!`);
        await ctx.reply(`移除${pluginName}插件成功喵～`);
    } catch (error) {
        logger.error(`移除文件时出错: ${error.message}`);
        await ctx.reply(`移除插件失败！${error}`);
    }
}