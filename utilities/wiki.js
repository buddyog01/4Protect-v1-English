const Discord = require("discord.js");
const fetch = require("node-fetch");
const db = require('quick.db');
const cl = new db.table("Color");
const config = require("../config");
const footer = config.app.footer;

module.exports = {
    name: 'wiki',
    usage: 'wiki <phrase>',
    description: `Search for a phrase on Wikipedia and provide information.`,
    async execute(client, message, args) {
      
        let color = cl.fetch(`color_${message.guild.id}`);
        if (color == null) color = config.app.color;

      
        if (!args[0]) {
            return message.channel.send("Please provide a phrase to search on Wikipedia.");
        }

        
        const searchTerm = args.join('_');
        const apiUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`;


            const response = await fetch(apiUrl);
            const data = await response.json();

       
            if (response.status !== 200) {
                return message.channel.send("No Wikipedia page found for this phrase.");
            }

          
            const embed = new Discord.MessageEmbed()
            .setTitle("Search Wikipedia on " + data.title)
            .setURL(data.content_urls.desktop.page)
            .setDescription(data.extract)
            .setColor(color)
            .setFooter(footer);

            message.channel.send({ embeds: [embed] });
        }
    }