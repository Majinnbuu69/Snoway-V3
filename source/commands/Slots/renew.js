const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'renew',
    description: {
        fr: "Renouveler un slot",
        en: "Renew a slot"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const mention = message.mentions.users.first();
        const args = message.content.split(' ');

        if (!mention) return message.channel.send("`❌` Mentionnez l'utilisateur dont le slot doit être renouvelé.");
        if (!args[2]) return message.channel.send("`❌` Précisez la durée. Exemple : `1 d`, `2 m`, etc.");
        if (!args[3]) return message.channel.send("`❌` Précisez la catégorie ou un nom de slot.");
        if (!args[4]) return message.channel.send("`❌` Précisez un nom ou un identifiant de slot.");

        const duration = parseInt(args[2]);
        const unit = args[3].toLowerCase();
        const slotName = args.slice(4).join(' ');

        if (isNaN(duration) || !['d', 'm'].includes(unit)) {
            return message.channel.send("`❌` Durée invalide. Utilisez `d` pour jour(s) ou `m` pour mois.");
        }

        const timeMultiplier = unit === 'd' ? 86400000 : 2592000000;
        const expiration = Date.now() + (duration * timeMultiplier);

        let data = [];
        if (fs.existsSync('./data.json')) {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        }

        const existing = data.find(slot => slot.user === mention.id);
        if (existing) {
            existing.expires = expiration;
            existing.name = slotName;
        } else {
            data.push({
                user: mention.id,
                expires: expiration,
                name: slotName,
                users: [],
                hold: false
            });
        }

        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
        message.channel.send(`\`✅\` Le slot de <@${mention.id}> a été renouvelé jusqu'au <t:${Math.floor(expiration / 1000)}:F>.`);
    }
};
