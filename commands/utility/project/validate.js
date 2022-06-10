const { Permissions } = require("discord.js");
module.exports = {
  async execute(message, interaction, database, projectName, projectPage) {
    const IDs = new Object();
    const category = `━━ 🎥 ${projectName} 🎥 ━━`;
    projectPage.setColor("#31ea69");
    message.edit({
      embeds: [projectPage],
    });
    interaction.guild.channels.cache
      .get("984102745722220554")
      .send({
        embeds: [projectPage],
      })
      .then((msg) => {
        IDs.msgId = msg.id;
      });

    //CREATE ROLES
    function CreateRoles() {
      return new Promise((resolve, reject) => {
        interaction.guild.roles
          .create({
            name: `${projectName} - Créateur·ice`,
            color: "GREY",
          })
          .then((role) => {
            IDs.creatorRoleId = role.id;
          });
        interaction.guild.roles
          .create({
            name: `${projectName} - Acteur·ices`,
            color: "GREY",
          })
          .then((role) => {
            IDs.actorsRoleId = role.id;
          });
        interaction.guild.roles
          .create({
            name: projectName,
            color: "GREY",
          })
          .then((role) => {
            IDs.globalRoleId = role.id;
          });
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    }

    //CREATE CATEGORY
    function CreateChannels() {
      return new Promise((resolve, reject) => {
        interaction.guild.channels
          .create(category, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.SEND_MESSAGES,
                ],
              },
              {
                id: IDs.globalRoleId,
                allow: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.CONNECT,
                  Permissions.FLAGS.SEND_MESSAGES,
                ],
              },
              {
                id: IDs.actorsRoleId,
                allow: [Permissions.FLAGS.CONNECT],
              },
            ],
          })
          .then((cat) => {
            IDs.catId = cat.id;
            //CHANNELS
            interaction.guild.channels.create(
              `🔴-informations-${projectName}`,
              {
                type: "GUILD_TEXT",
                topic: "Canal pour l'organisation, les dates et les réunions",
                parent: cat,
                permissionOverwrites: [
                  {
                    id: interaction.guild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL],
                  },
                  {
                    id: IDs.globalRoleId,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                  },
                  {
                    id: IDs.actorsRoleId,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                  },
                  {
                    id: IDs.creatorRoleId,
                    allow: [Permissions.FLAGS.SEND_MESSAGES],
                  },
                ],
              }
            );
            interaction.guild.channels.create(`🔧-général-${projectName}`, {
              type: "GUILD_TEXT",
              topic: "Canal général",
              parent: cat,
            });
            interaction.guild.channels.create(`🎭-acteur·ices-${projectName}`, {
              type: "GUILD_TEXT",
              topic: "Canal entre comédien·nes, et équipe technique",
              parent: cat,
              permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: [Permissions.FLAGS.VIEW_CHANNEL],
                },
                {
                  id: IDs.globalRoleId,
                  allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                  ],
                },
                {
                  id: IDs.actorsRoleId,
                  allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                  ],
                },
              ],
            });
            interaction.guild.channels.create(`📋-notes-${projectName}`, {
              type: "GUILD_TEXT",
              topic:
                "Canal pour épingler des idées, ou toute chose importante (NE PAS FLOOD SVP)",
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
          });
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    }

    async function CreateProject() {
      await CreateRoles();
      await CreateChannels();

      database.collection("projects").insertOne({
        name: projectName.toLowerCase(),
        categoryId: IDs.catId,
        globalRoleId: IDs.globalRoleId,
        creatorRoleId: IDs.creatorRoleId,
        actorsRoleId: IDs.actorsRoleId,
        msgId: IDs.msgId,
        projectPage: projectPage
      });
    }

    CreateProject();
  },
};
