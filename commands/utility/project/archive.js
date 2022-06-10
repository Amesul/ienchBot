module.exports = {
  async execute(interaction, database, projectName) {
    //Find project document in the database
    async function getIDs() {
      const IDs = await database
        .collection('projects')
        .find({
          name: projectName.toLowerCase(),
        })
        .toArray();
      return IDs[0];
    }

    //Get IDs
    const objectIDs = await getIDs();

    setTimeout(() => {
      //Find category & role
      const category = interaction.guild.channels.cache.get(
        objectIDs.categoryId
      );
      const globalRoleId = interaction.guild.roles.cache.get(
        objectIDs.globalRoleId
      );
      const creatorRoleId = interaction.guild.roles.cache.get(
        objectIDs.creatorRoleId
      );
      const actorsRoleId = interaction.guild.roles.cache.get(
        objectIDs.actorsRoleId
      );

      //Delete stuff
      globalRoleId.delete();
      creatorRoleId.delete();
      actorsRoleId.delete();

      interaction.guild.channels.cache.get('984102745722220554').messages.cache.get(objectIDs.msgId).delete();
      interaction.guild.channels.cache.get('984102956674744440').send(objectIDs.projectPage);

      category.children.forEach((channel) => {
        channel.delete();
      });
      category.delete();
      //Delete database document
      database.collection('projects').deleteOne({
        name: projectName.toLowerCase(),
      });
    }, 1000);
    //Response
    return interaction.reply(`Projet '*${projectName}*' supprimé !`);
  },
};
