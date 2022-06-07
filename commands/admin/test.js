const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  permissions: "ADMINISTRATOR",
  enable: true,
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Debug command. Restricted use to Amesul"),
  async execute(bot, interaction, database) {
    return interaction.reply("Test réussi");
  },
};
