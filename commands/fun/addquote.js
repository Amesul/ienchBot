const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
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
            .setRequired(true))
        .addStringOption(option =>
            option.setName('contexte')
            .setDescription('Le projet, lieu, instant où a été prononcée la citation')
            .setRequired(false)),
    async execute(bot, interaction, database) {
        const dt = new Date();
        database.collection("quotes").insertOne({
            quote: interaction.options.get('quote').value,
            name: interaction.options.get('name').value,
            contexte: interaction.options.get('contexte') ? interaction.options.get('contexte').value : '',
            date: `${dt.getDate() < 10 ? "0" + (dt.getDate()) : dt.getDate()}/${(dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1}/${dt.getFullYear()}`,
        });

        const quoteEmbed = new MessageEmbed().setTitle('Citation ajoutée !').setDescription(`***${interaction.options.get('quote').value}*** - ${interaction.options.get('name').value}\n ${interaction.options.get('contexte') ? interaction.options.get('contexte').value : ''}`)
        interaction.reply({
            embeds: [quoteEmbed],
            ephemeral: true
        })
    },
};