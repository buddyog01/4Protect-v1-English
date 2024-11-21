const Discord = require("discord.js");
const db = require('quick.db');
const cl = new db.table("Color");
const config = require("../config");
const footer = config.app.footer;

module.exports = {
    name: 'calc',
    usage: 'calc <calcul>',
    description: `Allows you to perform a calculation.`,
    execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`);
        if (color == null) color = config.app.color;

        if (!args[0]) {
            return message.channel.send("Please provide a calculation.");
        }

        const expression = args.join(' ');

        try {
            const result = eval(expression);

            const embed = new Discord.MessageEmbed()
                .setTitle("Result")
                .setDescription(`Your calculation \`${expression}\` gives the result : **${result}**`)
                .setColor(color)
                .setFooter(footer);

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            
            message.channel.send("For calculations: 1x1 = 1*1 | 1:1 = 1/1");
        }
    }
};
