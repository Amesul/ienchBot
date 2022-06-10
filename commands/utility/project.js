const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName("project")
    .setDescription("Gestion des projets")
    .setDefaultMemberPermissions(1024)
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
            .addUserOption((option) =>
              option
                .setName("member")
                .setDescription("Membre à ajouter")
                .setRequired(true)
            )
            .addBooleanOption((option) => option.setName("acteurice").setDescription('Le membre à ajouter est-iel un·e acteur·ice ?'))
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
        ).addStringOption((option) =>
          option
            .setName("pitch")
            .setDescription("Pitch du projet")
            .setRequired(true)
        ).addStringOption((option) =>
          option
            .setName("genre")
            .setDescription("Genre du projet")
            .setRequired(true)
        ).addIntegerOption((option) =>
          option
            .setName("duration")
            .setDescription("Durée du film")
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
    const subcommand = interaction.options.getSubcommand().toLowerCase();
    const projectName = interaction.options.getString("project-name");
    const subcommandFile = require(`./project/${subcommand}.js`);
    try {
      subcommandFile.execute(interaction, database, projectName);
    } catch {}
  },
};
