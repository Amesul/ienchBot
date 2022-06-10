const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const validateFile = require("./validate.js");
// const declineFile = require('decline.js')
module.exports = {
  async execute(interaction, database, projectName) {
    const projectCheck = await database.collection("projects").findOne({
      name: projectName.toLowerCase(),
    });

    if (projectCheck)
      return interaction.reply({
        content: `Le projet "*${projectName}*" existe déjà ! Si c'est une erreur, contacte un·e admin.`,
        ephemeral: true,
      });

    const creator = interaction.user;
    const pitch = interaction.options.getString("pitch");
    const genre = interaction.options.getString("genre");
    const duration = interaction.options.getInteger("duration");

    const projectPage = new MessageEmbed()
      .setTitle(projectName)
      .setDescription(pitch)
      .addField("Créé par", `<@${creator.id}>`)
      .addFields([
        {
          name: "Genre",
          value: genre,
          inline: true,
        },
        {
          name: "Durée",
          value: `${duration} minutes`,
          inline: true,
        },
      ])
      .setTimestamp();
    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("validate")
          .setLabel("Valider")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("decline")
          .setLabel("Refuser")
          .setStyle("DANGER")
      );
    interaction.guild.channels.cache
      .get("984103120957231235")
      .send({
        embeds: [projectPage],
        components: [buttons],
      })
      .then((msg) => {
        const collector = msg.createMessageComponentCollector({
          time: 60000,
        });
        collector.on("collect", async (i) => {
          if (i.customId === "validate")
            validateFile.execute(
              msg,
              interaction,
              database,
              projectName,
              projectPage
            );
          // if (i.customId === "decline") declineFile.execute(database, projectName, projectPage)
          buttons.components.forEach((element) => element.setDisabled(true));
          msg.edit({
            components: [buttons],
          });
        });
      });
    return interaction.reply({
      content: `Le projet "*${projectName}*" a été proposé ! S'il est accepté, tu le verras dans <#984102745722220554>`,
      ephemeral: true,
    });
  },
};
