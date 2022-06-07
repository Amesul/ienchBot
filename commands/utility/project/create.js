const { Permissions } = require("discord.js");
module.exports = {
  async execute(projectName, member, interaction, database) {
    const IDs = new Object();
    const category = `━━ 🎥 ${projectName} 🎥 ━━`;
    interaction.guild.roles
      .create({
        name: projectName,
        color: "GREY",
      })
      .then((role) => {
        IDs.roleId = role.id;
        //CATEGORY
        interaction.guild.channels
          .create(category, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL],
              },
              {
                id: interaction.guild.roles.cache.get(role.id),
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
              },
            ],
          })
          .then((cat) => {
            IDs.catId = cat.id;
            //CHANNELS
            interaction.guild.channels.create(`🔧-général-${projectName}`, {
              type: "GUILD_TEXT",
              topic: "Canal général",
              parent: cat,
            });
            interaction.guild.channels.create(`⚙-organisation-${projectName}`, {
              type: "GUILD_TEXT",
              topic: "Canal pour l'organisation, les dates et les réunions",
              parent: cat,
            });
            interaction.guild.channels.create(`📋-notes-${projectName}`, {
              type: "GUILD_TEXT",
              topic: "Canal pour épingler des idées, ou toute chose importante",
              parent: cat,
            });
            interaction.guild.channels.create(
              `📝-préprodudction-${projectName}`,
              {
                type: "GUILD_TEXT",
                topic: "Canal pour l'équipe de pré-production",
                parent: cat,
              }
            );
            interaction.guild.channels.create(
              `💻-postproduction-${projectName}`,
              {
                type: "GUILD_TEXT",
                topic: "Canal pour l'équipe de post-production",
                parent: cat,
              }
            );
            interaction.guild.channels.create(`🎥-matériel-${projectName}`, {
              type: "GUILD_TEXT",
              topic: "Canal pour gérer le matériel",
              parent: cat,
            });
            interaction.guild.channels.create(`🌈-hors-sujet-${projectName}`, {
              type: "GUILD_TEXT",
              topic: "Canal pour spam",
              parent: cat,
            });
            interaction.guild.channels.create(`🎙️ Vocal - ${projectName}`, {
              type: "GUILD_VOICE",
              parent: cat,
            });
            database.collection("projects").insertOne({
              name: projectName.toLowerCase(),
              categoryId: IDs.catId,
              roleId: IDs.roleId,
            });
          });
      });

    return interaction.reply(`Projet '*${projectName}*' créé !`);
  },
};
