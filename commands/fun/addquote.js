const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
module.exports = {
    permissions: "SEND_MESSAGES",
    enable: true,
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('addquote')
        .setDescription('Ajoute une citation au bot')
        .addStringOption(option =>
            option.setName('quote')
            .setDescription('Texte de la citation')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
            .setDescription('La personne qui a prononcé la citation')
            .setRequired(true)),
    async execute(bot, interaction, database) {
        const dt = new Date();
        database.collection("quotes").insertOne({
            quote: interaction.options.get('quote').value,
            name: interaction.options.get('name').value,
            date: `${dt.getDate()}/${(dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1}/${dt.getFullYear()}`,
        });
    },
};