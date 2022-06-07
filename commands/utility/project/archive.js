module.exports = {
    async execute(projectName, member, interaction, database) {
      //Find project entrie in the database
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
      category = interaction.guild.channels.cache.get(objectIDs.categoryId);
      role = interaction.guild.roles.cache.get(objectIDs.roleId);
      position =
        interaction.guild.channels.cache.filter(
          (channel) => channel.type === "GUILD_CATEGORY"
        ).size - 1;

      //Move category & delete associated role
      category.setPosition(position);
      role.delete();
      return interaction.reply(`Projet '*${projectName}*' archivé !`);
    },
  };
