const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');
const Discord = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Snoway} client
     * @param {Snoway} interaction
     */
    run: async (client, interaction) => {
        try {
            if (!interaction.isButton()) return;
            if (interaction.customId.startsWith('ticket_')) {
                const color = await client.db.get(`color_${interaction.guild.id}`) || client.config.color
                await interaction.deferReply({ ephemeral: true })
                const id = interaction.customId.split('_')[1];
                const db = await client?.db.get(`ticket_${interaction.guild.id}`);
                if (!db) return;

                const option = db.option.find(option => option.value === id);
                if (!option) return;


                const tickeruser = await client.db.get(`ticket_user_${interaction.guild.id}`) || [];
                const resul = tickeruser.find(ticket => ticket.author === interaction.user.id);
                
                if (interaction.member.roles.cache.some(role => db.rolerequis.includes(role.id))) {
                    return await interaction.editReply({ content: `Vous n'avez pas un des rôles requis pour ouvrir un ticket !` });
                }

                if (interaction.member.roles.cache.some(role => db.roleinterdit.includes(role.id))) {
                    return await interaction.editReply({ content: `Vous avez un des rôles interdit pour ouvrir un ticket !` });
                }
          

                let permissionOverwrites = [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user,
                        allow: [
                            Discord.PermissionFlagsBits.SendMessages,
                            Discord.PermissionFlagsBits.ViewChannel,
                            Discord.PermissionFlagsBits.AttachFiles,
                            Discord.PermissionFlagsBits.AddReactions
                        ]
                    }
                ];


                const channel = await interaction.guild.channels.create({
                    parent: client.channels.cache.get(option.categorie) ? option.categorie : null,
                    name: option.text + '-' + interaction.user.username,
                    type: 0,
                    permissionOverwrites: permissionOverwrites,
                });

                await interaction.editReply({ content: `Ticket open <#${channel?.id}>` });
                const salonlog = client.channels.cache.get(option.logs)
                if(salonlog) { 
                const embeds = new Discord.EmbedBuilder().setColor(color).setFooter(client.footer).setAuthor({ name: interaction.user.username + ' ' + interaction.user.id, iconURL: interaction.user.avatarURL() }).setTimestamp().setTitle('Ticket ouvert par ' + interaction.user.username)
                salonlog.send({
                    embeds: [embeds],
                })
            }
                const embed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setFooter(client.footer)
                    .setDescription(option.message)
                    .setTitle('Ticket ouvert par ' + interaction.user.username)

                const idunique = code(15)
                const mentionedRoles = option.mention ? option.mention.map(role => `<@&${role}>`).join(', ') : '';
                if (db.buttonclose || db.claimbutton) {
                    const buttonRow = new Discord.ActionRowBuilder();
                
                    if (db.buttonclose) {
                        buttonRow.addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel('Fermer le ticket')
                                .setStyle(4)
                                .setEmoji('🔒')
                                .setCustomId("close_" + idunique)
                        );
                    }
                
                    if (db.claimbutton) {
                        buttonRow.addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel('Récupère le ticket')
                                .setStyle(2)
                                .setEmoji('🔐')
                                .setCustomId("claim_" + idunique)
                        );
                    }
                
                    channel.send({
                        embeds: [embed],
                        content: mentionedRoles, 
                        components: [buttonRow]
                    });
                } else {
                    channel.send({
                        embeds: [embed],
                        content: mentionedRoles, 
                    });
                }

                tickeruser.push({
                    salon: channel.id,
                    author: interaction.user.id,
                    date: Date.now(),
                    id: idunique,
                    option: option.value,
                    claim: null,
                })
                await client.db.set(`ticket_user_${interaction.guild.id}`, tickeruser)
            }
        } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'Une erreur est survenue.', flags: 64 });
        }
    }
};


function code(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}