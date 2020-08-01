require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api'); 
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constant');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`
Привет ${ctx.message.from.first_name}!
Здесь вы можете узнать статистику по Коронавирусу.
Введите на английском название страны для получения статистики.
Посмотреть весь список стран можно командой /help
`, Markup.keyboard([
    ['US', 'Russia'],
    ['Uzbekistan', 'China']
])
.resize()
.extra()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('text', async (ctx) => {
    let data = {};

    try {
    data = await api.getReportsByCountries(ctx.message.text);

    const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смерти: ${data[0][0].deaths}
Выздровело: ${data[0][0].recovered}
    `;

    ctx.reply(formatData);
        } catch {
            console.log('ошибка');
            ctx.reply('ошибка такой страны не существует');
        }
});
bot.launch();
console.log('Bot started');

