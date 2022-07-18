const { Client, Intents } = require('discord.js');
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
client.login(process.env.dcToken);

require('./setClientCommands.js').execute(client);

client.once('ready', () => {
	client.events.get('ready').execute(client);
	require('./setSlashCommands.js').execute(client);
});

client.on('messageDelete', message => {
	client.events.get('messageDelete').execute(client, message);
});

client.on('messageDeleteBulk', messages => {
	messages.map(message => {
		client.events.get('messageDelete').execute(client, message);
	});
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	client.events.get('messageUpdate').execute(client, oldMessage, newMessage);
});

client.on('messageCreate', message => {
	client.events.get('message').execute(client, message);
});

client.on('interactionCreate', interaction => {
	client.events.get('interactionCreate').execute(client, interaction);
});

client.on('threadCreate', thread => {
	client.events.get('threadCreate').execute(client, thread);
});

client.on('threadUpdate', (oldThread, newThread) => {
	client.events.get('threadUpdate').execute(client, oldThread, newThread);
});