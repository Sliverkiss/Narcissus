const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'apt Plugin',
    execute: async (ctx) => {
        if (!ctx?.message?.text?.startsWith(',apt')) return;

        try {
            const res = await handle(ctx);
            ctx.reply(res.message);
        } catch (e) {
            logger.error(e);
            await ctx.reply($.toStr(e));
        }
    }
};

async function handle(ctx) {
    //移除插件
    if ($.command(ctx, ",apt remove")) {
        const [, , pluginName] = ctx?.message?.text?.split(" ");
        if (!pluginName) return { operation: "移除插件", message: "请传入移除插件名称" }
        return deletePlugin(pluginName);
    }
    if ($.command(ctx, ",apt install")) {
        const message = ctx?.message?.reply_to_message;
        if (!message?.document) return { operation: "添加插件", message: "⚠️请在需要安装的插件下回复该指令～" };
        //下载文件
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
        return addPlugin(pluginName, pluginContent);
    }
    return {
        operation: '查询菜单:',
        message: ',apt install\t直接回复文件\n ,apt remove [插件名]'
    };
}

/**
 * 安装插件
 * @param {string} pluginName - 插件名称
 * @param {string} fileContent - 文件内容
 * @returns {boolean} - 是否安装成功
 */
function addPlugin(pluginName, fileContent) {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建子目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugins', `${pluginName}.js`);

    try {
        // 写入文件内容
        fs.writeFileSync(pluginDir, fileContent);
        logger.info(`数据已写入到 ${pluginDir}`);
        return { operation: "添加插件", message: `添加${pluginName}插件成功喵～` };
    } catch (error) {
        logger.error(`写入文件时出错: ${error.message}`);
        return { operation: "添加插件", message: `添加插件失败！${error}` };
    }
}

/**
 * 移除插件
 * @param {string} pluginName - 插件名称
 * @returns {string} - 文件内容
 */
function deletePlugin(pluginName) {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    // 构建子目录的绝对路径
    const pluginDir = path.join(rootDir, 'plugins', `${pluginName}.js`);

    try {
        // 删除目录及其所有文件
        fs.unlinkSync(pluginDir, { recursive: true });
        logger.info(`成功移除插件 ${indexPath}!`);
        return { operation: "移除插件", message: `移除${pluginName}插件成功喵～` };;
    } catch (error) {
        logger.error(`写入文件时出错: ${error.message}`);
        return { operation: "移除插件", message: `移除插件失败！${error}` };
    }
}