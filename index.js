const fs = require('fs');
const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const {
    token,
    clientId,
    mongoPath
} = require('./config.json');

let database;
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://discord:sam010201SAM@cluster0-shard-00-00.wtw8u.mongodb.net:27017,cluster0-shard-00-01.wtw8u.mongodb.net:27017,cluster0-shard-00-02.wtw8u.mongodb.net:27017/?ssl=true&replicaSet=atlas-1ykgx1-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
  database = client.db("bande_de_iench");
});

//Discord Client
const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    presence: {
        status: 'dnd',
        activities: [{
            name: '🔴 MAINTENANCE 🔴',
            type: 'PLAYING'
        }]
    }
});

//COMMAND MAP
bot.commands = new Collection();
const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
}

bot.commands = new Collection();
bot.commandsadmin = new Collection();
bot.commandsutility = new Collection();
bot.commandsfun = new Collection();

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        bot.commands.set(command.data.name, command);
        if (folder == "admin") bot.commandsadmin.set(command.data.name, command);
        if (folder == "utility") bot.commandsutility.set(command.data.name, command);
        if (folder == "fun") bot.commandsfun.set(command.data.name, command);
    }
}

//BOT LAUNCH
bot.once("ready", () => {
    console.log("Ready !");
});

//bot.user.setPresence()

const cooldowns = new Collection();

//COMMAND HANDLER
bot.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    //Command enable
    if (!command.enable) {
        return interaction.reply({
            content: "Cette commande est temporairement désactivée :/",
            ephemeral: true
        });
    }

    //
    if (command.permissions) {
        const authorPerms = interaction.channel.permissionsFor(interaction.user);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return interaction.reply({
                content: "Tu n'as pas la permission de faire ça !",
                ephemeral: true
            });
        }
    }

    //Cooldown
    if (!cooldowns.has(command.commandName)) {
        cooldowns.set(command.commandName, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.commandName);
    const cooldownAmount = command.cooldown * 1000;
    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = expirationTime - now;

            function DateFormat(duration) {
                let seconds = Number(duration.toFixed(0) / 1000);
                var d = Math.floor(seconds / (3600 * 24));
                var h = Math.floor((seconds % (3600 * 24)) / 3600);
                var m = Math.floor((seconds % 3600) / 60);
                var s = Math.floor(seconds % 60);
                var dDisplay = d > 0 ? d + (d == 1 ? " jour, " : " jours, ") : "";
                var hDisplay = h > 0 ? h + (h == 1 ? " heure, " : " heures, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " seconde" : " secondes") : "";
                return dDisplay + hDisplay + mDisplay + sDisplay;
            }
            const authorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!authorPerms || !authorPerms.has('ADMINISTRATOR')) {
                return interaction.reply({
                    content: `Tu dois attendre *${DateFormat(
          timeLeft
        )}* avant de pouvoir réutiliser cette commande !`,
                    ephemeral: true
                });
            }
        }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    //Launch command
    try {
        await command.execute(bot, interaction, database);
    } catch (error) {
        console.error(error);
        return interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        });
    }
});

//HELLO
bot.on("messageCreate", message => {
    var user = message.author.id;
    var alea = Math.floor(Math.random() * 3);
    var hey_message = message.content.toLocaleLowerCase();

    if (
        message.mentions.users.first() == clientId &&
        (hey_message.includes(`bonjour`) ||
            hey_message.includes(`salut`) ||
            hey_message.includes(`hello`) ||
            hey_message.includes(`coucou`) ||
            hey_message.includes(`hey`))
    ) {
        if (alea == 0) {
            message.channel.send(`Coucou <@${user}> !`);
        }
        if (alea == 1) {
            message.channel.send(`Salut <@${user}> !`);
        }
        if (alea == 2) {
            message.channel.send(`Hello <@${user}> !`);
        }
        if (alea == 3) {
            message.channel.send(`Bien le bonjour <@${user}> !`);
        }
    }
});

//LOGIN
bot.login(token);
