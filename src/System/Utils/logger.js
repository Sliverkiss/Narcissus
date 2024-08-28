class BaseContext {
  constructor(logger, level, message, error, params) {
    this.date = new Date();
    this.pid = process.pid;
    this.logger = logger;
    this.level = level;
    this.message = message;
    if (params == null) {
      params = [];
    }
    if (error) {
      if (error instanceof Error) {
        this.error = error;
      } else {
        params.unshift(error);
      }
    }
    this.params = params;
  }
}

const Level = {
  TRACE: 'trace', DEBUG: 'debug', INFO: 'info', WARN: 'warn', ERROR: 'error'
};
Object.freeze(Level);

const getBaseContext = (logger, level, message, error, params) => {
  const context = new BaseContext(logger, level, message, error, params);
  Object.freeze(context);
  return context;
};

/**
 * 全局的ContextHolder
 */
const contextHolder = {
  logger: (baseContext) => baseContext.logger,
  pid: (baseContext) => baseContext.pid,
  date: (baseContext) => baseContext.date,
  level: (baseContext) => baseContext.level,
  message: (baseContext) => baseContext.message,
  params: (baseContext) => baseContext.params,
  error: (baseContext) => baseContext.error
};
/**
 * 全局日志配置
 */
const loggerGlobalConfig = {
  /**
   * 日志文本构造器
   * @param contextHolder 上下文管理器
   * @param baseContext 基本上下文
   * @return {string} 最后的消息
   */
  messageBuilder: (contextHolder, baseContext) => {
    let base = `${contextHolder.date(baseContext)} ${contextHolder.pid(baseContext)} [${contextHolder.level(
        baseContext)}:${contextHolder.logger(baseContext)}]: ${contextHolder.message(baseContext)}`;
    if (contextHolder.params(contextHolder)) {
      base += `, data:${contextHolder.params(baseContext)}`;
    }
    return (baseContext.error) ? base + `, error:\n${contextHolder.error(baseContext)}` : base;
  },
  writer: [async (contextHolder, baseContext, lastMessage) => {
    console[baseContext.level](lastMessage);
  }],
  enableLevels: ['trace', 'debug', 'info', 'warn', 'error']
};

class Logger {
  /**
   * 日志收集器启用级别，详见Level
   */
  #enableLevels;
  //日志收集器->context holder->获得日志组件(这个是全配置的，包含Logger单独的配置、小程序函数、日志输出)，提供一个默认输出的日志组件->消息构造器MessageBuilder(消息模板、消息函数)->日志日志输出器
  #logger;

  constructor(logger, enableLevels) {
    this.#enableLevels = enableLevels;
    this.#logger = logger;
  }

  static getLogger(logger) {
    return new Logger(logger, loggerGlobalConfig.enableLevels);
  }

  trace(message, error, ...data) {
    this.#invoker(Level.TRACE, message, error, ...data);
  }

  debug(message, error, ...data) {
    this.#invoker(Level.DEBUG, message, error, ...data);
  }

  info(message, error, ...data) {
    this.#invoker(Level.INFO, message, error, ...data);
  }

  warn(message, error, ...data) {
    this.#invoker(Level.WARN, message, error, ...data);
  }

  error(message, error, ...data) {
    this.#invoker(Level.ERROR, message, error, ...data);
  }

  async #invoker(level, message, error, ...data) {
    if (this.#enableLevels.includes(level)) {
      const baseContext = getBaseContext(this.#logger, level, message, error, data);
      const lastMsg = await loggerGlobalConfig.messageBuilder(contextHolder, baseContext);
      for (const w of loggerGlobalConfig.writer) {
        w(contextHolder, baseContext, lastMsg).catch((e) => {console.error(`logger writer error:${e}`);});
      }
    }
  }
}

class LoggerConfig {
  /**
   *
   * @param {string} contextKey
   * @param {function(BaseContext):string} customContext
   */
  static regContext(contextKey, customContext) {
    if (contextHolder[contextKey]) {
      throw `key ${contextKey} 已存在:${contextHolder[contextKey]}`;
    }
    LoggerConfig.setContext(contextKey, customContext);
  }

  /**
   *
   * @param {string} contextKey
   * @param {function(BaseContext):string} customContext
   */
  static setContext(contextKey, customContext) {
    contextHolder[contextKey] = this.#asyncWrapper(customContext);
  }

  /**
   *
   * @param {(function(contextHolder,BaseContext))} messageBuilder
   */
  static setMessageBuilder(messageBuilder) {
    loggerGlobalConfig.messageBuilder = messageBuilder;
  }

  /**
   * 启用日志级别
   * @param {string} levels 日志级别，小写
   */
  static enableLevel(...levels) {
    if (levels == null || levels.length === 0) {
      loggerGlobalConfig.enableLevels.length = 0;
      return;
    }
    //校验
    for (const level of levels) {
      if (!Level[level.toUpperCase()]) {
        console.error(`不支持日志级别:${level}`);
        return;
      }
    }
    loggerGlobalConfig.enableLevels = levels;
  }

  static #asyncWrapper(func) {
    if (func instanceof Promise || func.constructor.name === 'AsyncFunction') {
      return func;
    }
    return async (...data) => func(...data);
  }
}

/*const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  warn: (message, error) => {
    if (error) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, error);
    }else {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }
  },
  error: (message, error) => {
    if (error) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    }else{
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    }
  }
};*/

//配置日志，使之和上面老日志一样
/**
 * 用于存放请求的Trace
 * @type {Map<String, String>}
 */
LoggerConfig.regContext('timeFormat', baseContext => {
  return baseContext.date.toISOString();
});

LoggerConfig.setMessageBuilder(async (contextHolder, baseContext) => {
  const base = `[${baseContext.level.toUpperCase()}] ${await contextHolder.timeFormat(baseContext)} - ${baseContext.message}`;
  return baseContext.error ? base + `\n${baseContext.error}` : base;
});
LoggerConfig.enableLevel(Level.INFO, Level.WARN, Level.ERROR);
const globalLogger = Logger.getLogger('Narcissus');
globalLogger.warn('全局记录器初始化，请在未来替换成模块或者更细化的日志。');
export {Logger};
export default globalLogger;
//todo 这个应该细分到每一个模块，但现在是重构，未来重写的时候再说
