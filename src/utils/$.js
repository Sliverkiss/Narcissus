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
    },
    QingLong: (HOST, Client_ID, Client_Secret) => {
        const Request = async (t, m = "GET") => {
            try {
                let { headers: h, params, body: b, url: u } = t;
                //处理get请求头部
                if (m.toUpperCase() == "GET" && params) {
                    let queryString = new URLSearchParams(params).toString();
                    u = `${u}?${queryString}`;
                }
                let opts = {
                    method: m.toUpperCase(),
                    headers: h,
                    body: b
                }
                let response = await fetch(u, opts);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                let res = await response.json();
                return res;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        };
        return new (class {
            /**
            * 对接青龙API
            * @param {*} HOST http://127.0.0.1:5700
            * @param {*} Client_ID xxx
            * @param {*} Client_Secret xxx
            */
            constructor(HOST, Client_ID, Client_Secret) {
                this.host = HOST;
                this.clientId = Client_ID;
                this.clientSecret = Client_Secret;
                this.token = "";
                this.envs = [];
            }
            // 获取用户密钥
            async getAuthToken() {
                const options = {
                    url: `${this.host}/open/auth/token`,
                    params: {
                        client_id: this.clientId,
                        client_secret: this.clientSecret,
                    },
                };
                try {
                    console.log(`传入参数: ${JSON.stringify(options)}`);
                    const { code, data, message } = await Request(options);
                    if (code === 200) {
                        const { token, token_type, expiration } = data;
                        this.token = `${token_type} ${token}`;
                    } else {
                        throw message || "Failed to obtain user token.";
                    }
                } catch (e) {
                    throw e
                        ? typeof e === "object"
                            ? JSON.stringify(e)
                            : e
                        : "Network Error.";
                }
            }
            /**
            * 获取所有环境变量详情
            */
            async getEnvs() {
                const options = {
                    url: `${this.host}/open/envs`,
                    headers: {
                        'Authorization': this.token,
                    },
                };
                try {
                    const { code, data, message } = await Request(options);
                    if (code === 200) {
                        this.envs = data;
                        console.log(`✅Obtaining environment variables succeeded.`);
                    } else {
                        throw message || `Failed to obtain the environment variable.`;
                    }
                } catch (e) {
                    throw e
                        ? typeof e === "object"
                            ? JSON.stringify(e)
                            : e
                        : "Network Error.";
                }
            }

            checkEnvByName(name) {
                return this.envs.findIndex((item) => item.name === name);
            }
            checkEnvByRemarks(remarks) {
                return this.envs.findIndex((item) => item.remarks === remarks);
            }
            checkEnvByValue(value, regex) {
                const match = value.match(regex);
                if (match) {
                    const index = this.envs.findIndex((item) =>
                        item.value.includes(match[0])
                    );
                    if (index > -1) {
                        console.log(`🆗${value} Matched: ${match[0]}`);
                        return index;
                    } else {
                        console.log(`⭕${value} No Matched`);
                        return -1;
                    }
                } else {
                    console.log(`⭕${value} No Matched`);
                    return -1;
                }
            }
            selectEnvByName(name) {
                return this.envs.filter((item) => item.name === name);
            }
            selectEnvByRemarks(remarks) {
                return this.envs.filter((item) => item.remarks === remarks);
            }
            /**
            * 添加环境变量
            * @param {*} array [{value:'变量值',name:'变量名',remarks:'备注'}]
            */
            async addEnv(array) {
                const options = {
                    url: `${this.host}/open/envs`,
                    headers: {
                        Authorization: this.token,
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify(array),
                };
                try {
                    const { code, message } = await Request(options, "post");
                    if (code === 200) {
                        console.log(`✅The environment variable was added successfully.`);
                    } else {
                        throw message || "Failed to add the environment variable.";
                    }
                } catch (e) {
                    throw e
                        ? typeof e === "object"
                            ? JSON.stringify(e)
                            : e
                        : "Network Error.";
                }
            }
            /**
             * 修改环境变量
            * @param {*} obj {value:'变量值',name:'变量名',remarks:'备注',id:0}
            */
            async updateEnv(obj) {
                const options = {
                    url: `${this.host}/open/envs`,
                    method: "put",
                    headers: {
                        Authorization: this.token,
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify(obj),
                };
                try {
                    const { code, message } = await Request(options, "post");
                    if (code === 200) {
                        console.log(`✅The environment variable was updated successfully.`);
                        await this.enableEnv([obj._id]);
                    } else {
                        throw message || "Failed to update the environment variable.";
                    }
                } catch (e) {
                    throw e
                        ? typeof e === "object"
                            ? JSON.stringify(e)
                            : e
                        : "Network Error.";
                }
            }
            /**
            * 删除环境变量
            * @param {*} ids [0,1,2] -> id数组
            */
            async deleteEnv(ids) {
                const options = {
                    url: `${this.host}/open/envs`,
                    method: "delete",
                    headers: {
                        Authorization: `${this.token}`,
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify(ids),
                };
                try {
                    const { code, message } = await Request(options, "post");
                    if (code === 200) {
                        console.log(`✅The environment variable was deleted successfully.`);
                    } else {
                        throw message || "Failed to delete the environment variable.";
                    }
                } catch (e) {
                    throw e
                        ? typeof e === "object"
                            ? JSON.stringify(e)
                            : e
                        : "Network Error.";
                }
            }
            /**
             * 启用环境变量
             * @param {*} ids [0,1,2] -> id数组
             */
            async enableEnv(ids) {
                const options = {
                    url: `${this.host}/open/envs/enable`,
                    method: "put",
                    headers: {
                        Authorization: `${this.token}`,
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify(ids),
                };
                try {
                    const { code, message } = await Request(options, "post");
                    if (code === 200) {
                        console.log(`✅The environment variable was enabled successfully.`);
                    } else {
                        throw message || "Failed to enable the environment variable.";
                    }
                } catch (e) {
                    throw e
                        ? typeof e === "object"
                            ? JSON.stringify(e)
                            : e
                        : "Network Error.";
                }
            }
            /**
             * 获取单个环境变量详情
             * @param {*} id
             * @returns 变量id
             */
            async getEnvById(id) {
                const options = {
                    url: `${this.host}/open/envs/${id}`,
                    headers: {
                        Authorization: `${this.token}`,
                    },
                };
                try {
                    const { code, data, message } = await Request(options);
                    console.log(data);
                    console.log(data.value);
                    if (code === 200) {
                        return data;
                    } else {
                        throw message || `Failed to get the environment variable.`;
                    }
                } catch (e) {
                    throw e
                        ? typeof e === "object"
                            ? JSON.stringify(e)
                            : e
                        : "Network Error.";
                }
            }
        })(HOST, Client_ID, Client_Secret);
    }
}
