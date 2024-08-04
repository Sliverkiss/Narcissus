/**
 * 解析参数
 * @param {string} message
 * @return {string[] | undefined} 参数列表
 */
const getParams = (message) => {
	const split = message?.split(' ');
	split?.shift();
	return split;
};
const MessageUtil = {getParams};
module.exports = MessageUtil;