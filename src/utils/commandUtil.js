/**
 * 解析命令字符串
 * @param {string} input - 输入的命令字符串
 * @returns {object} - 包含command和params的对象
 */
function parseCommand(input) {
    // 确保输入是字符串
    if (typeof input !== 'string') {
        throw new Error('输入必须是字符串');
    }

    // 去掉字符串前后的空格
    const trimmedInput = input.trim();

    // 使用正则表达式匹配命令和参数
    const [command, ...params] = trimmedInput.split(' ');
    return {
        command: command.substring(1), // 去掉逗号
        params: params
    };
}



module.exports = { parseCommand }