export default  {
    name: 'Hello Plugin',
    promise:"personal",
    execute: (ctx) => {
      if (ctx?.message && ctx?.message.text === '/start') {
        logger.info("测试全局调用成功！")
        ctx.reply('Hello World!');
      }
    }
  };