const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    permissions: 'SEND_MESSAGES',
    enable: true,
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('deleteproject')
        .setDescription('Supprime un projet')
        .addStringOption(option => option.setName('name').setDescription('Nom du projet').setRequired(true)),
    async execute(bot, interaction, database) {
        //Get project name
        const name = interaction.options.getString('name');

        //Find project document in the database
        async function getIDs() {
            const IDs = await database.collection('projects').find({
                name: name.toLowerCase()
            }).toArray();
            return IDs[0]
        }

        //Get IDs
        const objectIDs = await getIDs();

        //Find category & role
        category = interaction.guild.channels.cache.get(objectIDs.categoryId);
        role = interaction.guild.roles.cache.get(objectIDs.roleId);
        //Delete stuff
        role.delete()
        category.children.forEach(channel => {
            channel.delete()
        });
        category.delete()

        //Delete database document
        database.collection('projects').deleteOne({
            name: name.toLowerCase()
        });

        //Response
        return interaction.reply(`Projet '*${name}*' supprimé !`);
    },
};