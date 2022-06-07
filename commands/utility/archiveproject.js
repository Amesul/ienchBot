const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    permissions: 'SEND_MESSAGES',
    enable: true,
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('archiveproject')
        .setDescription('Archive un projet terminé')
        .addStringOption(option => option.setName('name').setDescription('Nom du projet').setRequired(true)),
    async execute(bot, interaction, database) {
        //Get project name
        const name = interaction.options.getString('name');

        //Find project entrie in the database
        async function getIDs() {
            const IDs = await database.collection('projects').find({
                name: name.toLowerCase()
            }).toArray();
            return IDs[0]
        }

        //Get IDs
        const objectIDs = await getIDs();
        category = interaction.guild.channels.cache.get(objectIDs.categoryId);
        role = interaction.guild.roles.cache.get(objectIDs.roleId);
        position = interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size - 1

        //Move category & delete associated role
        category.setPosition(position)
        role.delete()
        return interaction.reply(`Projet '*${name}*' archivé !`);
    },
};