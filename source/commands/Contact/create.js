const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../../../data.json');

function loadData() {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '{}');
  return JSON.parse(fs.readFileSync(dataPath));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'create',
  run: async (client, message, args) => {
    const mention = message.mentions.users.first();
    if (!mention) return message.reply('❌ Mentionne un utilisateur.');

    const duration = args[1];
    const type = args[2];
    const category = args[3];
    const slotName = args.slice(4).join(' ');

    if (!duration || !type || !category || !slotName) {
      return message.reply('❌ Utilisation : ,create @user 1 d category Slot Name');
    }

    const data = loadData();
    const slotId = message.channel.id;

    data[slotId] = {
      owner: mention.id,
      duration,
      type,
      category,
      slotName,
      members: [mention.id],
      hold: false
    };

    saveData(data);
    message.reply(`✅ Slot \`${slotName}\` créé.`);
  }
};
