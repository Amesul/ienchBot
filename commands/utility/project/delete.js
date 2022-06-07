module.exports = {
    async execute(projectName, member, interaction, database) {
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

      //Find category & role
      category = interaction.guild.channels.cache.get(objectIDs.categoryId);
      role = interaction.guild.roles.cache.get(objectIDs.roleId);
      //Delete stuff
      role.delete();
      category.children.forEach((channel) => {
        channel.delete();
      });
      category.delete();

      //Delete database document
      database.collection("projects").deleteOne({
        name: projectName.toLowerCase(),
      });

      //Response
      return interaction.reply(`Projet '*${projectName}*' supprimé !`);
    },
  };
