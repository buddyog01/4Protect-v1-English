const Discord = require("discord.js");
const db = require('quick.db');
const cl = new db.table("Color");
const config = require("../config");
const fs = require('fs');
const moment = require('moment');
const footer = config.app.footer;
const links = [
    'discord.gg',
    'dsc.bio',
    'www',
    'https',
    'http',
    '.ga',
    '.fr',
    '.com',
    '.tk',
    '.ml',
    '://',
    '.gg'
];

moment.locale('fr');

module.exports = {
    name: 'snipe',
    usage: 'snipe',
    description: `Allows you to display the last message deleted on the server`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`);
        if (color == null) color = config.app.color;

        let isLinkall = false;

        const msg = client.snipes.get(message.channel.id);
        if (!msg) return message.channel.send("No messages have been deleted recently!");

        links.forEach(l => {
            if (msg.content.includes(l)) {
                isLinkall = true;
            }
        });

        if (isLinkall == true) {
            const embedl = new Discord.MessageEmbed()
                .setDescription(`**${msg.author.tag}** \`\`\`discord.gg/******\`\`\``);
            return message.channel.send({ embeds: [embedl] });
        }

        const now = moment();
        const messageTime = moment(msg.createdAt);
        let temps;

        if (now.isSame(messageTime, 'day')) {
            temps = `Today at ${messageTime.format('HH:mm')}`;
        } else {
            temps = messageTime.format('DD/MM/YYYY à HH:mm');
        }


        const embed = new Discord.MessageEmbed()
            .setDescription(`**${msg.author.tag}** \n${msg.content}`)
            .setColor(color)
            .setFooter({ text: `${temps}` });
        
        if (msg.image) embed.setImage(msg.image);

        message.channel.send({ embeds: [embed] });
    }
};
