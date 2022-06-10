const {
  SlashCommandBuilder
} = require("@discordjs/builders");
module.exports = {
  enable: true,
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Debug command. Restricted use to Amesul")
    .setDefaultMemberPermissions(8),
  async execute(bot, interaction, database) {
    return interaction.reply("Test réussi");
  },
};