const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rep')
        .setDescription('Génère un message +rep avec ID, produit et prix')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID de la personne')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('produit')
                .setDescription('Produit acheté')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prix')
                .setDescription('Prix payé')
                .setRequired(true)),

    async execute(interaction) {
        const id = interaction.options.getString('id');
        const produit = interaction.options.getString('produit');
        const prix = interaction.options.getString('prix');

        const message = `+rep ${id} | ${produit} | ${prix}`;

        await interaction.reply({
            content: `Voici ton message à copier :\n\`\`\`${message}\`\`\``,
            ephemeral: true
        });
    }
};
