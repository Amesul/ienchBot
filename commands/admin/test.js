const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    permissions: "ADMINISTRATOR",
    enable: true,
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Debug command.\nRestricted use to Amesul'),
    async execute(bot, interaction, database) {
        dt = new Date()
        return interaction.reply('Test réussi');
    },
};