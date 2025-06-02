const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');

module.exports = {
    name: 'nuke',
    description: {
        fr: "Supprimer tous les messages du salon (requiert les permissions propriétaire)",
        en: "Delete all messages in the channel (requires owner permissions)"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        // Vérifier si l'auteur est le propriétaire du bot (ou autre contrôle)
        if (!client.dev.includes(message.author.id)) {
            return message.channel.send({ content: "`❌` Vous n'avez pas la permission d'utiliser cette commande." });
        }

        try {
            // On clone le channel pour supprimer tout son contenu rapidement
            const newChannel = await message.channel.clone();
            await message.channel.delete();

            // Envoyer un message dans le nouveau channel pour confirmer
            newChannel.send("Le salon a été nuké par " + `<@${message.author.id}>`);
        } catch (error) {
            console.error(error);
            message.channel.send({ content: "`❌` Une erreur est survenue lors de la suppression des messages." });
        }
    }
};
