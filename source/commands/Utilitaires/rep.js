const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'reper',
    description: {
        fr: 'Génère un message +rep formaté.',
        en: 'Generate a formatted +rep message.'
    },

    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (args.length < 3) {
            return message.reply("❌ Utilisation : `rep <ID> <Produit> <Prix>`\nExemple : `rep 12345 Clé FiveM 25€`");
        }

        const id = args[0];
        const price = args[args.length - 1];
        const product = args.slice(1, -1).join(" ");

        const finalMessage = `+rep ${id} | ${product} | ${price}`;

        const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle('Message +rep généré')
            .setDescription(`\`\`\`${finalMessage}\`\`\``)
            .setFooter({ text: `Commande utilisée par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

        message.reply({ embeds: [embed] });
    },
};
