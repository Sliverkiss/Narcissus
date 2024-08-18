module.exports = {
    name: 'Hello Plugin',
    promise:"personal",
    execute: (ctx) => {
      if (ctx?.message && ctx?.message.text === '/message') {
        ctx.reply($.toStr(ctx?.message));
      }
    }
  };