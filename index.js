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

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoDBuri;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
require('./myMongoDB.js').execute(mongoClient);

client.login(process.env.dcToken);

client.once('ready', () => {
	client.events.get('ready').execute(client);
	require('./setSlashCommands.js').execute(client);
});

client.on('interactionCreate', interaction => {
	client.events.get('interactionCreate').execute(client, interaction);
});