const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'unhold',
    description: {
        fr: "Relancer un slot mis en pause",
        en: "Unhold a paused slot"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const mention = message.mentions.users.first();
        if (!mention) return message.channel.send("`❌` Mentionnez l'utilisateur dont vous voulez relancer le slot.");

        let data = [];
        if (fs.existsSync('./data.json')) {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        }

        const slot = data.find(s => s.user === mention.id);
        if (!slot) return message.channel.send("`❌` Aucun slot trouvé pour cet utilisateur.");

        if (!slot.hold) return message.channel.send("`❌` Ce slot n'était pas en pause.");

        slot.hold = false;
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        message.channel.send(`\`▶️\` Le slot de <@${mention.id}> a été relancé.`);
    }
};
