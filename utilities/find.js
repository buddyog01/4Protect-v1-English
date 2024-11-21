const Discord = require("discord.js")
const db = require('quick.db')
const cl = new db.table("Color")
const owner = new db.table("Owner")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')

module.exports = {
    name: 'find',
    usage: 'find',
    description: `Allows you to search for a member by voice in the server.`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let embed = new Discord.MessageEmbed()
            .setTitle("Voice search")
            .setColor(color)
            .addField(
                `The member is in Voice Channel:`,
                member.voice.channel
                    ? `<#${member.voice.channel.id}>`
                    : `The member is not in a voice channel.`,
                true
            )
        message.channel.send({ embeds: [embed] })
    }
}
