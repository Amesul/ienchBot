const {
    MessageEmbed
} = require('discord.js')
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    permissions: "SEND_MESSAGES",
    enable: true,
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Retourne une croustillante citation, toujours hors-contexte bien évidemment.'),
    async execute(bot, interaction, database) {
        async function getQuote() {
            const quoteSize = await database.collection('quotes').countDocuments({
                validate: true
            })
            const rand = Math.floor(Math.random() * quoteSize)
            const quoteObj = await database
                .collection("quotes").find({
                    validate: true
                })
                .limit(1)
                .skip(rand)
                .toArray();
            return quoteObj[0]
        }
        const quote = await getQuote();

        const quoteMessage = new MessageEmbed().setDescription(`*${quote.quote.trim()}* - ${quote.name.trim()}, ${quote.date ? `le ${quote.date}.` : 'à une date inconnue.'}`)
        interaction.reply({
            embeds: [quoteMessage]
        })
    },
}