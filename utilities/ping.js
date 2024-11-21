const ms = require('ms')
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js');
const config = require("../config")
const db = require('quick.db')
const cl = new db.table("Color")
const footer = config.app.footer

module.exports = {
    name: 'ping',
    description: `Allows you to see the bot latency in milliseconds.`,

    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        const embed = new Discord.MessageEmbed()
        embed.setTitle("Bot latency")
        embed.addField('BOT', client.ws.ping + 'ms', true)
        embed.setColor(color)
        message.channel.send({ embeds: [embed] }).then(async msg => {
            embed.addField("API", msg.createdTimestamp - message.createdTimestamp + 'ms', true)
            msg.edit({ embeds: [embed] })
        })
    }
}
