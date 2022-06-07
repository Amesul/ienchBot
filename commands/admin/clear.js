const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    options
} = require('nodemon/lib/config');
module.exports = {
    permissions: "ADMINISTRATOR",
    enable: true,
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime le nombre de message demandé')
        .addIntegerOption(option => option.setName('number').setDescription('Nombre de message à supprimer').setRequired(true)),
    async execute(bot, interaction, database) {
        const amount = interaction.options.getInteger('number');
        interaction.channel.bulkDelete(amount, true)
        return interaction.reply({
            content: `${amount} messages supprimés`,
            ephemeral: true
        });
    },
};