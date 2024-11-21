const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const cl = new db.table("Color");
const config = require("../config");
const moment = require('moment');
require('moment/locale/fr');
const emote = require('../emotes.json');

moment.locale('fr');

module.exports = {
    name: 'serveur',
    usage: 'serveur',
    description: `Allows you to display server information`,
    async execute(client, message, args) {
        let color = cl.fetch(`color_${message.guild.id}`);
        if (color == null) color = config.app.color;

        if (!args[0]) {
            return message.channel.send("Please provide a valid argument (pic, banner, info).");
        }

        if (args[0] === "pic") {
            let pic = message.guild.iconURL();
            if (pic) {
                const picembed = new MessageEmbed()
                    .setTitle(`${message.guild.name}`)
                    .setColor(color)
                    .setImage(message.guild.iconURL({ dynamic: true, size: 1024 }));
                message.channel.send({ embeds: [picembed] });
            } else {
                const nopic = new MessageEmbed()
                    .setTitle(`${message.guild.name}`)
                    .setColor(color)
                    .setDescription(`This server does not have an avatar`);
                message.channel.send({ embeds: [nopic] });
            }
        } else if (args[0] === "banner") {
            let banner = message.guild.bannerURL();
            if (banner) {
                const bannerembed = new MessageEmbed()
                    .setTitle(`${message.guild.name}`)
                    .setColor(color)
                    .setImage(message.guild.bannerURL({ dynamic: true, size: 512 }));
                message.channel.send({ embeds: [bannerembed] });
            } else {
                const nobanner = new MessageEmbed()
                    .setTitle(`${message.guild.name}`)
                    .setColor(color)
                    .setDescription('This server does not have a banner');
                message.channel.send({ embeds: [nobanner] });
            }
        } else if (args[0] === "info") {
            const premiumTier = {
                NONE: 0,
                TIER_1: 1,
                TIER_2: 2,
                TIER_3: 3,
            };

            const verifLevels = {
                NONE: "None",
                LOW: "Weak",
                MEDIUM: "Average",
                HIGH: "High",
                VERY_HIGH: "Maximum",
            };

            const rolesGuild = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const membersGuild = message.guild.members.cache;
            const channelsGuild = message.guild.channels.cache;
            const emojisGuild = message.guild.emojis.cache;

            let desc = message.guild.description;
            if (desc == null) desc = "The server does not have a description !";

            const embed = new MessageEmbed()
                .setColor(color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setImage(message.guild.bannerURL({ dynamic: true, size: 512 }))
                .setTitle(`Information about \`${message.guild.name}\``)
                .setDescription(`**Description**\n ${desc}`)
                .addFields(
                    { name: `${emote.utilitaire.id} ID of Server`, value: `${message.guild.id}`, inline: true },
                    { name: `${emote.utilitaire.blackcrown} Owner`, value: `<@${message.guild.ownerId}>`, inline: true },
                    { name: `${emote.utilitaire.id} ID of Owner`, value: `${message.guild.ownerId}`, inline: true },
                    { name: `${emote.utilitaire.membres} Number of Members`, value: `${message.guild.memberCount || '0'}`, inline: true },
                    { name: "Number of Boosts", value: `${message.guild.premiumSubscriptionCount || '0'}`, inline: true },
                    { name: `${emote.utilitaire.boosts} Boost Level`, value: `${premiumTier[message.guild.premiumTier]}`, inline: true },
                    { name: `${emote.utilitaire.bots} Number of Bots`, value: `${membersGuild.filter(member => member.user.bot).size}`, inline: true },
                    { name: `${emote.utilitaire.iconrole} Number of Roles`, value: `${rolesGuild.length}`, inline: true },
                    { name: `${emote.utilitaire.salon} Number of Channels`, value: `${channelsGuild.size}`, inline: true },
                    { name: `${emote.utilitaire.emotes} Number of Emojis`, value: `${emojisGuild.size}`, inline: true },
                    { name: `${emote.utilitaire.loading} Date of Creation`, value: `${moment(message.guild.createdAt).format('LLLL')}`, inline: true },
                    { name: `${emote.utilitaire.link} Vanity URL`, value: message.guild.vanityURLCode ? `discord.gg/${message.guild.vanityURLCode}` : `This Server doesn't have a Vanity URL`, inline: true },
                    { name: `${emote.utilitaire.iconsettings} Verification Level`, value: `${verifLevels[message.guild.verificationLevel]}`, inline: true }
                )
                .setFooter({ text: `${config.app.footer}` });
            message.channel.send({ embeds: [embed] });
        } else {
        }
    }
};
