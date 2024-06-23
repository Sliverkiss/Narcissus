/*
!name=查询天气
!command=weather
!description=这个人很懒，什么都没有留下。
*/
function loadPlugin() {
    return {
        runScript
    }
}
const icons = {
    "01d": "🌞",
    "01n": "🌚",
    "02d": "⛅️",
    "02n": "⛅️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧",
    "09n": "🌧",
    "10d": "🌦",
    "10n": "🌦",
    "11d": "🌩",
    "11n": "🌩",
    "13d": "🌨",
    "13n": "🌨",
    "50d": "🌫",
    "50n": "🌫"
};

async function runScript(bot, ctx, params) {
    const city = ctx.message.text.split(' ').slice(1).join(' ');
    if (!city) {
        return ctx.reply("出错了呜呜呜 ~ 无效的参数。");
    }
    let message="";
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?appid=973e8a21e358ee9d30b47528b43a8746&units=metric&lang=zh_cn&q=${city}`);
        if (response.status === 200) {
            const data = await response.json();
            const cityName = `${data.name}, ${data.sys.country}`;
            const timeZoneShift = data.timezone;
            const tempMax = data.main.temp_max.toFixed(2);
            const tempMin = data.main.temp_min.toFixed(2);
            const pressure = data.main.pressure;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const windDirection = calcWindDirection(data.wind.deg);
            const sunriseTime = timestampToTime(data.sys.sunrise, timeZoneShift);
            const sunsetTime = timestampToTime(data.sys.sunset, timeZoneShift);
            const feelsLike = data.main.feels_like;
            const tempInC = data.main.temp.toFixed(2);
            const tempInF = (1.8 * tempInC + 32).toFixed(2);
            const icon = data.weather[0].icon;
            const desc = data.weather[0].description;

            const res = `${cityName} ${icons[icon]}${desc} 💨${windDirection} ${windSpeed}m/s\n大气🌡 ${tempInC}℃ (${tempInF}℉) 💦 ${humidity}% \n体感🌡 ${feelsLike}℃\n气压 ${pressure}hpa\n🌅${sunriseTime} 🌇${sunsetTime}`;

            message=await ctx.reply(res);
        } else if (response.status === 404) {
            message=await ctx.reply("出错了呜呜呜 ~ 无效的城市名，请使用拼音输入 ~ ");
        }
    } catch (error) {
       message=await ctx.reply("出错了呜呜呜 ~ 无法访问到 openweathermap.org 。");
    }
    setTimeout(() => ctx.telegram.deleteMessage(ctx.chat.id, message.message_id), 2e4);
}

function timestampToTime(timestamp, timeZoneShift) {
    const date = new Date((timestamp + timeZoneShift) * 1000);
    return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
}

function calcWindDirection(windDirection) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const ix = Math.round(windDirection / (360.0 / dirs.length));
    return dirs[ix % dirs.length];
}
