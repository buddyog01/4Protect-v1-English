const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("../config");
const db = require('quick.db');

const cl = new db.table("Color");
const p1 = new db.table("Perm1");
const p2 = new db.table("Perm2");
const p3 = new db.table("Perm3");
const owner = new db.table("Owner");

module.exports = {
    name: 'role',
    description: `Provides access to information about a role.`,
    async execute(client, message, args) {
        try {
            let color = cl.get(`color_${message.guild.id}`) || config.app.color;

            const perm1 = p1.get(`perm1_${message.guild.id}`);
            const perm2 = p2.get(`perm2_${message.guild.id}`);
            const perm3 = p3.get(`perm3_${message.guild.id}`);

            const isOwner = owner.get(`owners.${message.author.id}`);
            const hasPermission = [perm1, perm2, perm3].some(perm => message.member.roles.cache.has(perm));
            const isAuthorized = isOwner || hasPermission || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id);

            if (!isAuthorized) 
                return message.channel.send('You are not authorized to use this command');

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
            if (!role) 
                return message.channel.send('Please specify a role.');

            let membersWithRole = role.members.map(member => member.user.tag).filter((value, index, self) => self.indexOf(value) === index);

            const perms = {
                KICK_MEMBERS: "Kick Members",
                BAN_MEMBERS: "Ban Members",
                MANAGE_WEBHOOKS: "Manage Webhooks",
                VIEW_AUDIT_LOG: "View Audit Logs",
                MANAGE_ROLES: "Manage Roles",
                MANAGE_CHANNELS: "Manage Channels",
                MANAGE_GUILD: "Manage Guild"
                // Add other dangerous or elevated permissions here if necessary
            };

            const dangerousPerms = Object.keys(perms).filter(perm => role.permissions.has(perm));

            const allPermissions = dangerousPerms.map(perm => perms[perm]).join(", ");

            const roleEmbed = new MessageEmbed()
                .setColor(color)
                .addField("Role Name", `<@&${role.id}>`)
                .addField("Color Hex", role.hexColor === "#000000" ? "Classique" : role.hexColor)
                .addField("Role ID", role.id)
                .addField("Is it displayed seperately ?", role.hoist ? "Yes" : "No")
                .addField("Is it Mentionable ?", role.mentionable ? "Yes" : "No")
                .addField("Is it managed by an integration", role.managed ? "Yes" : "No")
                .addField("Main permissions", allPermissions || "None")
                .setFooter(config.app.footer);

            const membersButton = new MessageButton()
                .setCustomId('members_button')
                .setLabel('Members with the role')
                .setStyle('PRIMARY');

            const removeRoleButton = new MessageButton()
                .setCustomId('remove_role_button')
                .setLabel('Delete role from a member')
                .setStyle('DANGER');

            const closeButton = new MessageButton()
                .setCustomId('close_button')
                .setLabel('Close')
                .setStyle('SECONDARY');

            const row = new MessageActionRow()
                .addComponents(membersButton, removeRoleButton, closeButton);

            const sentMessage = await message.channel.send({ embeds: [roleEmbed], components: [row] });

            const filter = i => ['members_button', 'remove_role_button', 'close_button'].includes(i.customId) && i.user.id === message.author.id;

            const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'members_button') {
                    if (membersWithRole.length > 0) {
                        const membersEmbed = new MessageEmbed()
                            .setColor(color)
                            .setTitle(`Members with the role ${role.name}`)
                            .setDescription(membersWithRole.join('\n'));

                        await i.reply({ embeds: [membersEmbed], ephemeral: true });
                    } else {
                        await i.reply({ content: 'No Member has this role', ephemeral: true });
                    }
                } else if (i.customId === 'remove_role_button') {
                    const mention = await message.channel.send("Please mention the member whose role you want to remove.");

                    const filter = response => {
                        return message.author.id === response.author.id && response.mentions.members.first();
                    };
                
                    message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                        .then(async collected => {
                            const member = collected.first().mentions.members.first();
                            
                            if (!member) {
                                return message.channel.send("Membre introuvable.");
                            }
                
                            try {
                                await member.roles.remove(role);
                                await message.channel.send(`The role ${role.name} was deleted successfully ${member.user.tag}.`);
                            } catch (error) {
                             
                            }
                        })
                        .catch(() => {
                        
                        });
                
                    mention.delete();
                } else if (i.customId === 'close_button') {
                    await sentMessage.delete();
                }
            });

            collector.on('end', () => {
                row.components.forEach(component => component.setDisabled(true));
                sentMessage.edit({ components: [row] });
            });

        } catch (error) {
            console.error("An error occurred while executing the command 'role':", error);
        }
    }
};
