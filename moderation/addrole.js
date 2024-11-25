const Discord = require("discord.js");
const config = require("../config");
const db = require("quick.db");
const owner = new db.table("Owner");
const cl = new db.table("Color");
const ml = new db.table("modlog");
const pgs = new db.table("PermGs");

module.exports = {
    name: 'addrole',
    usage: 'addrole',
    description: `Allows you to add a role to a member.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {
            if (!args[0]) return message;

            let color = cl.fetch(`color_${message.guild.id}`);
            if (color == null) color = config.app.color;

            if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

                let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
                if (!member) return;

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                if (!role) return message.channel.send(`No roles found for \`${args[1] || "Nothing"}\``);

                await member.roles.add(role.id, `Role added by ${message.author.tag}`);

                message.channel.send(`1 role added to 1 member`);

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`➕ <@${message.author.id}> used the command \`addrole\` on ${member}\nRole added : ${role}`)
                    .setTimestamp()
                    .setFooter({ text: `📚` });
                const logchannel = client.channels.cache.get(ml.fetch(`${message.guild.id}.modlog`));
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);

            } else if (message.member.roles.cache.has(pgs.get(`permgs_${message.guild.id}`)) === true) {

                let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
                if (!member) return;

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                if (!role) return message.channel.send(`No roles found for \`${args[1] || "Nothing"}\``);

                await member.roles.add(role.id, `Role added by ${message.author.tag}`);

                message.channel.send(`1 role added to 1 member`);

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`➕ <@${message.author.id}> used the command \`addrole\` on ${member}\nRole Added : ${role}`)
                    .setTimestamp()
                    .setFooter({ text: `📚` });
                const logchannel = client.channels.cache.get(ml.get(`${message.guild.id}.modlog`));
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);

            }
        }
    }
};
