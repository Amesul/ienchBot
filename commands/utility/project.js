const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
  permissions: "SEND_MESSAGES",
  enable: true,
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName("project")
    .setDescription("Gestion des projets")
    .addSubcommandGroup((group) =>
      group
        .setName("member")
        .setDescription("Gestion des membres au sein des projets")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("Ajoute un membre au projet")
            .addStringOption((option) =>
              option
                .setName("project-name")
                .setDescription("Nom du projet")
                .setRequired(true)
            )
            .addMentionableOption((option) =>
              option
                .setName("member")
                .setDescription("Membre à ajouter")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription("Retire un membre du projet")
            .addStringOption((option) =>
              option
                .setName("project-name")
                .setDescription("Nom du projet")
                .setRequired(true)
            )
            .addMentionableOption((option) =>
              option
                .setName("member")
                .setDescription("Membre à enlever")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Crée un projet")
        .addStringOption((option) =>
          option
            .setName("project-name")
            .setDescription("Nom du projet")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("archive")
        .setDescription("Archive un projet terminé")
        .addStringOption((option) =>
          option
            .setName("project-name")
            .setDescription("Nom du projet")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Supprime un projet")
        .addStringOption((option) =>
          option
            .setName("project-name")
            .setDescription("Nom du projet")
            .setRequired(true)
        )
    ),

  async execute(bot, interaction, database) {
    const projectName = interaction.options.getString("project-name");
    const member = interaction.options.getMentionable("member") || undefined;
    const subcommand = interaction.options.getSubcommand().toLowerCase();
    const subcommandFile = require(`./project/${subcommand}.js`);
    try {
      subcommandFile.execute(projectName, member, interaction, database);
    } catch {}
  },
};
