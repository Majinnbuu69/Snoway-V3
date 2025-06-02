module.exports = {
  name: 'add',
  run: async (client, message, args) => {
    const mention = message.mentions.users.first();
    if (!mention) return message.reply('❌ Mentionne un utilisateur.');

    const data = loadData();
    const slot = data[message.channel.id];
    if (!slot) return message.reply('❌ Aucun slot trouvé ici.');

    if (!slot.members.includes(mention.id)) {
      slot.members.push(mention.id);
      saveData(data);
      message.reply(`✅ ${mention.tag} ajouté au slot.`);
    } else {
      message.reply('❌ Utilisateur déjà dans le slot.');
    }
  }
};
