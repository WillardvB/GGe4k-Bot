const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	]
});

client.once('ready', () => {
	client.events.get('ready').execute(client);
	require('./setSlashCommands.js').execute(client);
});

client.on('interactionCreate', interaction => {
	client.events.get('interactionCreate').execute(client, interaction);
});

client.login(process.env.dcToken);

client.events = new Collection();
client.slashCommands = new Collection();
const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
const slashCommandFiles = fs.readdirSync(__dirname + '/dc_commands/_slash/commandUse').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const command = require(`./events/${file}`);
	client.events.set(command.name, command);
}
for (const file of slashCommandFiles) {
	const command = require(`./dc_commands/_slash/commandUse/${file}`);
	client.slashCommands.set(command.name, command);
}