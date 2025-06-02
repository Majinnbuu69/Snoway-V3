const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'notify',
    description: {
        fr: 'Envoie un ping en MP avec le lien du message.',
        en: 'Send a ping via DM with the message link.'
    },

    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.reply("❌ Utilisation : `notify @user`\nExemple : `notify @Majin`");
        }

        const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

        try {
            await user.send({
                content: `📬 <@${user.id}> You have been mentioned: ${messageLink}`
            });

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle('✅ Notification envoyée')
                .setDescription(`Le message a bien été envoyé à <@${user.id}> en privé.`)
                .setFooter({ text: `Commande utilisée par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.reply({ embeds: [embed] });

        } catch (error) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Erreur')
                .setDescription(`Impossible d'envoyer un message privé à <@${user.id}>. L'utilisateur a peut-être les DM désactivés.`)
                .setFooter({ text: `Commande utilisée par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.reply({ embeds: [errorEmbed] });
        }
    }
};
