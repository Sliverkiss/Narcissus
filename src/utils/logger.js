const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  warn: (message, error) => {
    //todo 未来提高复用性
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
};

module.exports = logger;