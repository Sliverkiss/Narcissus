const {pluginManager} = require('../bot');
const MessageUtil = require('../utils/messageUtil');
const logger = require('../utils/logger');
const doInstall = async (ctx) => {
	const message = ctx.message.reply_to_message;
	if (message?.document) {
		// 获取文件信息
		const file = message.document;
		const fileId = file.file_id;
		const fileName = file.file_name;
		//提取插件名称
		pluginName = fileName.replace(/\.js$/, '');
		// 下载文件
		const fileLink = await ctx.telegram.getFileLink(fileId);
		try {
			await pluginManager.installFromUrl(fileLink, pluginName);
			return {operation: '安装插件', message: '已安装完成，请等待加载'}
		} catch (e){
			logger.error(`安装插件失败:${e}`);
			return {operation: '安装插件', message: e.message}
		}

	} else {
		//如果没带有文件则提示信息
		return {operation: '安装插件', message: `回复请用文件`};
	}
};
/**
 * 删除插件
 * @param pluginName 插件名称
 */
const doDelete = (pluginName) => {
	pluginManager.uninstallPlugin(pluginName);
};
/**
 * 处理消息
 * @param ctx
 * @return {{message:string,operation:string}} 消息
 */
const handle = async (ctx) => {
	if (ctx?.message?.text?.startsWith(',apt remove')) {
		//删除的逻辑
		const params = MessageUtil.getParams(ctx.message.text);
		doDelete(params[1]);
		return {operation: '删除插件', message: '操作完成'};
	}
	if (ctx?.message?.reply_to_message) {
		return await doInstall(ctx);
	}
	return {
		operation: '查询菜单:',
		message: ',apt install\t直接回复文件\n ,apt remove [模块名]'
	};
};
module.exports = {
	name: '【插件管理器】',
	execute: async (ctx) => {
		if (!ctx?.message?.text?.startsWith(',apt') || ctx?.message?.reply_to_message?.text !== ',apt install') {
			return;
		}
		try {
			const res = await handle(ctx);
			ctx.reply(`${res.operation}\n${res.message}`);
		} catch (e) {
			logger.error(e);
		}
	}
};
