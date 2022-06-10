const {
  SlashCommandBuilder
} = require("@discordjs/builders");
module.exports = {
  enable: true,
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Supprime le nombre de message demandé")
    .setDefaultMemberPermissions(8)
    .addIntegerOption((option) =>
      option
      .setName("number")
      .setDescription("Nombre de message à supprimer")
      .setRequired(true)
    ),
  async execute(bot, interaction, database) {
    const amount = interaction.options.getInteger("number");
    if (amount > 100)
      interaction.reply({
        content: 'Impossible de supprimer autant de messages !'
      })
    else {
      interaction.channel.bulkDelete(amount, true).then((messages) =>
        interaction.reply({
          content: `${messages.size} messages supprimés`,
          ephemeral: true,
        })
      );
    }

  },
};