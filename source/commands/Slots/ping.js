const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'ping',
    description: {
        fr: "Envoyer une notification dans le salon du slot",
        en: "Send a notification in the slot channel"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        let pingData = [];
        if (fs.existsSync('./pingstore.json')) {
            pingData = JSON.parse(fs.readFileSync('./pingstore.json', 'utf8'));
        }

        // Trouver le slot lié au salon actuel
        const slot = pingData.find(p => p.channel === message.channel.id);
        if (!slot) return message.channel.send("`❌` Aucun slot configuré pour ce salon.");

        let mentionText = "";
        if (args.length === 0) {
            mentionText = `<@${slot.user}>`;
        } else if (args[0].toLowerCase() === "everyone") {
            mentionText = "@everyone";
        } else if (args[0].toLowerCase() === "@here") {
            mentionText = "@here";
        } else if (message.mentions.roles.size > 0) {
            mentionText = message.mentions.roles.map(r => `<@&${r.id}>`).join(" ");
        } else if (message.mentions.users.size > 0) {
            mentionText = message.mentions.users.map(u => `<@${u.id}>`).join(" ");
        } else {
            mentionText = `<@${slot.user}>`;
        }

        message.channel.send({ content: `${mentionText} Vous avez une notification dans ce slot.` });
    }
};
