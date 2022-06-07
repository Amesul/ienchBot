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
      role = interaction.guild.roles.cache.get(objectIDs.roleId);

      member.roles.remove(role);

      return interaction.reply(
        `${member} retiré·e du projet '*${projectName}*' !`
      );
    },
  };
