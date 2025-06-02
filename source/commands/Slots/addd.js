const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'add',
    description: {
        fr: "Ajouter un utilisateur à un slot",
        en: "Add a user to a slot"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const mention = message.mentions.users.first();
        if (!mention) return message.channel.send("`❌` Vous devez mentionner un utilisateur.");

        if (!fs.existsSync('./data.json')) return message.channel.send("`❌` Aucun slot trouvé.");

        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        const slot = data.find(s => s.user === message.author.id);

        if (!slot) return message.channel.send("`❌` Vous ne possédez aucun slot.");

        if (!slot.users) slot.users = [];
        if (slot.users.includes(mention.id)) return message.channel.send("`❌` Cet utilisateur est déjà dans le slot.");

        slot.users.push(mention.id);
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        message.channel.send(`\`✅\` L'utilisateur <@${mention.id}> a été ajouté à votre slot.`);
    }
};
