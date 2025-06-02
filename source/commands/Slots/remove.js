const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'remove',
    description: {
        fr: "Retirer un utilisateur de son slot",
        en: "Remove a user from their slot"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const mention = message.mentions.users.first();
        if (!mention) return message.channel.send("`❌` Mentionnez l'utilisateur à retirer.");

        let data = [];
        if (fs.existsSync('./data.json')) {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        }

        const index = data.findIndex(s => s.user === mention.id);
        if (index === -1) return message.channel.send("`❌` Aucun slot trouvé pour cet utilisateur.");

        const removed = data.splice(index, 1);
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        message.channel.send(`\`🗑️\` Le slot de <@${mention.id}> a été retiré.`);
    }
};
