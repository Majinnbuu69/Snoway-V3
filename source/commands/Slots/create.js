const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'create',
    description: {
        fr: "Créer un slot",
        en: "Create a slot"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const args = message.content.split(' ').slice(1);
        const mention = message.mentions.users.first();
        const duration = args[1];
        const type = args[2];
        const category = args[3];
        const slotName = args.slice(4).join(" ");

        if (!mention || !duration || !type || !category || !slotName) {
            return message.channel.send("`❌` Syntaxe : ,create @user 1 d category1 Slot Name");
        }

        const slotData = {
            user: mention.id,
            duration,
            type,
            category,
            name: slotName,
            createdAt: Date.now()
        };

        let data = [];
        if (fs.existsSync('./data.json')) {
            data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        }

        data.push(slotData);
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        message.channel.send(`\`✅\` Slot \`${slotName}\` créé pour <@${mention.id}> (${duration}${type}) dans \`${category}\`.`);
    }
};
