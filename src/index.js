const { Client, Collection, IntentsBitField } = require('discord.js');
const fs = require('fs');
let _intents = new IntentsBitField(
	IntentsBitField.Flags.DirectMessageReactions,
	IntentsBitField.Flags.DirectMessageTyping,
	IntentsBitField.Flags.DirectMessages,
	IntentsBitField.Flags.GuildBans,
	IntentsBitField.Flags.GuildEmojisAndStickers,
	IntentsBitField.Flags.GuildIntegrations,
	IntentsBitField.Flags.GuildInvites,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.GuildMessageTyping,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildPresences,
	IntentsBitField.Flags.GuildScheduledEvents,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.GuildWebhooks,
	//IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.MessageContent,
)
const client = new Client({ intents: _intents });

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