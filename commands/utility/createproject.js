const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    Permissions
} = require('discord.js');
module.exports = {
    permissions: 'SEND_MESSAGES',
    enable: true,
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('createproject')
        .setDescription('Crée un nouveau projet')
        .addStringOption(option => option.setName('name').setDescription('Nom du projet').setRequired(true)),
    async execute(bot, interaction, database) {
        const IDs = new Object;
        const name = interaction.options.getString('name');
        const category = name.length < 10 ? `━━━━━ ${name} ━━━━━` : `━━ ${name} ━━`
        interaction.guild.roles.create({
            name: name,
            color: 'GREY'
        }).then(role => {
            IDs.roleId = role.id
            //CATEGORY
            interaction.guild.channels.create(category, {
                type: 'GUILD_CATEGORY',
                permissionOverwrites: [{
                        id: interaction.guild.id,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: interaction.guild.roles.cache.get(role.id),
                        allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                ],
            }).then(cat => {
                IDs.catId = cat.id
                //CHANNELS
                interaction.guild.channels.create(`🔧-général-${name}`, {
                    type: 'GUILD_TEXT',
                    topic: 'Canal général',
                    parent: cat
                });
                interaction.guild.channels.create(`⚙-organisation-${name}`, {
                    type: 'GUILD_TEXT',
                    topic: 'Canal pour l\'organisation, les dates et les réunions',
                    parent: cat
                });
                interaction.guild.channels.create(`📋-notes-${name}`, {
                    type: 'GUILD_TEXT',
                    topic: 'Canal pour épingler des idées, ou toute chose importante',
                    parent: cat
                });
                interaction.guild.channels.create(`📝-préprodudction-${name}`, {
                    type: 'GUILD_TEXT',
                    topic: 'Canal pour l\'équipe de pré-production',
                    parent: cat
                });
                interaction.guild.channels.create(`💻-postproduction-${name}`, {
                    type: 'GUILD_TEXT',
                    topic: 'Canal pour l\'équipe de post-production',
                    parent: cat
                });
                interaction.guild.channels.create(`🎥-matériel-${name}`, {
                    type: 'GUILD_TEXT',
                    topic: 'Canal pour gérer le matériel',
                    parent: cat
                });
                interaction.guild.channels.create(`🌈-hors-sujet-${name}`, {
                    type: 'GUILD_TEXT',
                    topic: 'Canal pour spam',
                    parent: cat
                });
                interaction.guild.channels.create(`🎙️ Vocal - ${name}`, {
                    type: 'GUILD_VOICE',
                    parent: cat
                });
                console.log(IDs);
                database.collection('projects').insertOne({
                    name: name.toLowerCase(),
                    categoryId: IDs.catId,
                    roleId: IDs.roleId
                });
            })
        })

        return interaction.reply(`Projet '*${name}*' créé !`);
    },
};