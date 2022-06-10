const {
  MessageEmbed
} = require("discord.js");
const {
  SlashCommandBuilder
} = require("@discordjs/builders");
module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription(
      "Retourne une croustillante citation, toujours hors-contexte bien évidemment."
    ).setDefaultMemberPermissions(1024),
  async execute(bot, interaction, database) {
    async function getQuote() {
      const quoteSize = await database.collection("quotes").countDocuments({});
      const rand = Math.floor(Math.random() * quoteSize);
      const quoteObj = await database
        .collection("quotes")
        .find({})
        .limit(1)
        .skip(rand)
        .toArray();
      return quoteObj[0];
    }
    const quote = await getQuote();

    const quoteMessage = new MessageEmbed().setDescription(
      `***${quote.quote.trim()}*** - ${quote.name.trim()}, le ${quote.date}.\n${
        quote.contexte ? `${quote.contexte}` : ""
      }`
    );
    interaction.reply({
      embeds: [quoteMessage],
    });
  },
};