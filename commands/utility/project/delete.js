module.exports = {
  async execute(interaction, database, projectName) {
    //Find project document in the database
    async function getIDs() {
      const IDs = await database
        .collection("projects")
        .find({
          name: projectName.toLowerCase(),
        })
        .toArray();
      return IDs[0];
    }

    //Get IDs
    const objectIDs = await getIDs();
    const member = interaction.guild.members.cache
    .get(interaction.user.id)
    if (
      !member.roles.cache.find((role) => role.id === objectIDs.creatorRoleId)
    ) {
      return interaction.reply({
        content: `Tu n'es pas propriétaire du projet "*${projectName}*", tu ne peux pas le supprimer sale chien !`,
      });
    }

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


      try {
        interaction.guild.channels.cache
        .get("984102745722220554")
        .messages.cache.get(objectIDs.msgId)
        .delete();
      } catch (error) {
        console.log('Message non supprimé')
      }

      category.children.forEach((channel) => {
        channel.delete();
      });
      category.delete();
      //Delete database document
      database.collection("projects").deleteOne({
        name: projectName.toLowerCase(),
      }); //Response
      return interaction.reply({
        content: `Projet '*${projectName}*' supprimé !`,
        ephemeral: true,
      });
    }, 1000);
  },
};
