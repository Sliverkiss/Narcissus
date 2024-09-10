export default {
    isAdmin: (ctx) => {
        return ctx?.message?.from?.id == config?.adminId;
    },
    toObj: (str, defaultValue = null) => {
        try {
            return JSON.parse(str)
        } catch {
            return this.toTable(str) ?? defaultValue
        }
    },
    toStr: (obj, defaultValue = null, ...args) => {
        try {
            return JSON.stringify(obj, ...args)
        } catch {
            return defaultValue
        }
    },
    toYml:(jsonObj, indent = 0)=> {
        const result = [];
        const indentation = '  '.repeat(indent); // 控制缩进

        for (let key in jsonObj) {
            if (typeof jsonObj[key] === 'object' && jsonObj[key] !== null) {
                result.push(`${indentation}${key}:`);
                result.push(this.toYml(jsonObj[key], indent + 1)); // 递归处理嵌套对象
            } else {
                result.push(`${indentation}${key}: ${jsonObj[key]}`);
            }
        }

        return result.join('\n');
    },
    command: (ctx, str) => {
        return ctx?.message?.text?.startsWith(str);
    },
    getTime: () => {
        // 创建当前的 UTC 时间对象
        const utcDate = new Date();
        // 获取中国时间偏移量（UTC+8小时）
        const chinaOffset = 8 * 60; // 偏移量以分钟为单位
        // 将当前 UTC 时间转换为中国时间
        const chinaTime = new Date(utcDate.getTime() + chinaOffset * 60 * 1000);
        // 格式化中国时间为字符串（例如 "YYYY-MM-DD HH:mm:ss"）
        const year = chinaTime.getFullYear();
        const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
        const day = String(chinaTime.getDate()).padStart(2, '0');
        const hours = String(chinaTime.getHours()).padStart(2, '0');
        const minutes = String(chinaTime.getMinutes()).padStart(2, '0');
        const seconds = String(chinaTime.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    time: (fmt, ts = null) => {
        const date = ts ? new Date(ts) : new Date()
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + '').substr(4 - RegExp.$1.length)
            )
        for (let k in o)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length)
                )
        return fmt
    },
    queryStr: (options) => {
        let queryString = ''

        for (const key in options) {
            let value = options[key]
            if (value != null && value !== '') {
                if (typeof value === 'object') {
                    value = JSON.stringify(value)
                }
                queryString += `${key}=${value}&`
            }
        }
        queryString = queryString.substring(0, queryString.length - 1)

        return queryString
    },
    wait: (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }
}
