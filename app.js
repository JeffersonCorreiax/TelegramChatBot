const env = require('./.env');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');

const bot = new Telegraf(env.token);



const buttons = list => Extra.markup(
    Markup.inlineKeyboard(
        list.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns : 3}
    )
);


bot.use(session());


bot.start( async content => {
    const name = content.update.message.from.first_name;

    await content.reply(`Bem-vindo, ${name}`);
    await content.reply(`Digite os produtos que deseja adicionar ao carrinho`);
    content.session.list = [];
});


bot.on('text', content => {
    let msg = content.update.message.text;
    content.session.list.push(msg);
    content.reply( `Produto adicionado!`, buttons(content.session.list) );
});



bot.action(/delete (.+)/, content => {
    content.session.list = content.session.list.filter( item => item !== content.match[1] )

    content.reply( `${content.match[1]} deletado`, buttons(content.session.list) );
});



bot.startPolling();

