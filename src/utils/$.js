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
    toTable: (json, defaultValue = null, ...args) => {
        try {
            jsonObject = { ...jsonObject, ...args }
            const keys = Object.keys(jsonObject);
            const keyValueStrings = keys.map(key => `${key}:${jsonObject[key]}`);
            const resultString = keyValueStrings.join('\n');

            return resultString;
        } catch (error) {
            return defaultValue;
        }
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
    },
    MongoDB: (BASE_URL, DATA_SOURCE, DATABASE, COLLECTION, API_KEY) => {
        return new (class {
            constructor(BASE_URL, DATA_SOURCE, DATABASE, COLLECTION, API_KEY) {
                this.BASE_URL = BASE_URL;
                this.dataSource = DATA_SOURCE;
                this.database = DATABASE;
                this.collection = COLLECTION;
                this.apiKey = API_KEY;
            }
            //公共接口
            async commonPost(options) {
                const { url: u, headers: h, body: b, method: m = "POST" } = options;

                const opts = {
                    method: m,
                    headers: {
                        "api-key": this.apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...h
                    },
                    body: JSON.stringify({
                        dataSource: this.dataSource,
                        database: this.database,
                        collection: this.collection,
                        ...b
                    })
                };

                try {
                    const response = await fetch(`${this.BASE_URL}${u}`, opts);
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.log('Error:', error);
                    throw error;
                }
            }
            //查找单个文档
            async findOne(document) {
                const opts = {
                    url: "/findOne",
                    body: { filter: document }
                }
                return await this.commonPost(opts);
            }
            //查找多个文档
            async find(document) {
                const opts = {
                    url: "/find",
                    body: { filter: document }
                }
                return await this.commonPost(opts);

            }
            //插入单个文档
            async insertOne(document) {
                const opts = {
                    url: "/insertOne",
                    body: { document: document }
                }
                return await this.commonPost(opts);
            }
            //插入多个文档
            async insertMany(document) {
                const opts = {
                    url: "/insertMany",
                    body: { documents: document }
                }
                return await this.commonPost(opts);
            }
            //更新单个文档
            async updateOne(filter, document) {
                const opts = {
                    url: "/updateOne",
                    body: { filter: filter, update: document }
                }
                return await this.commonPost(opts);
            }
            //更新多个文档
            async updateMany(filter, document) {
                const opts = {
                    url: "/updateMany",
                    body: { filter: filter, update: document }
                }
                return await this.commonPost(opts);
            }
            //删除单个文档
            async deleteOne(filter) {
                const opts = {
                    url: "/deleteOne",
                    body: { filter: filter }
                }
                return await this.commonPost(opts);
            }
            //删除多个文档
            async deleteMany(filter) {
                const opts = {
                    url: "/deleteMany",
                    body: { filter: filter }
                }
                return await this.commonPost(opts);
            }
        })(BASE_URL, DATA_SOURCE, DATABASE, COLLECTION, API_KEY);
    }
}
