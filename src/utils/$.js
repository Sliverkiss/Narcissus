export default {
    isAdmin: (ctx) => {
        return ctx?.message?.from?.id == config?.adminId;
    },
    toObj: (str, defaultValue = null) => {
        try {
            return JSON.parse(str)
        } catch {
            return defaultValue
        }
    },
    toStr: (obj, defaultValue = null, ...args) => {
        try {
            return JSON.stringify(obj, ...args)
        } catch {
            return defaultValue
        }
    },
    command(ctx, str) {
        return ctx?.message?.text?.startsWith(str);
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