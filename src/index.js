const {Client, Collection, IntentsBitField} = require('discord.js');
const fs = require('fs');
const {connect: connectE4kClient} = require('./e4kClient');

const { setGlobalDispatcher, Agent } = require('undici');

setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }) )

const intentsBitFields = [];
for (let i in IntentsBitField.Flags) {
    intentsBitFields.push(IntentsBitField.Flags[i]);
}
let _intents = new IntentsBitField(intentsBitFields);
const dcClient = new Client({intents: _intents, });

dcClient.once('ready', async () => {
    dcClient.events.get('ready').execute(dcClient);
    await require('./setSlashCommands.js').execute(dcClient);
});

dcClient.on('interactionCreate', interaction => {
    dcClient.events.get('interactionCreate').execute(dcClient, interaction);
});
dcClient.on('messageCreate', interaction => {
    dcClient.events.get('messageCreate').execute(dcClient, interaction);
});

if(process.env.mode === 'debug') dcClient.on("debug", str => {console.log(str)})

dcClient.events = new Collection();
dcClient.slashCommands = new Collection();
const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
//const slashCommandFiles = fs.readdirSync(__dirname + '/dc_commands/_slash/commandUse').filter(file => file.endsWith('.js'));
const slashCommandFiles = fs.readdirSync(__dirname + '/dc_commands/slash').filter(file => !file.includes('.'));
for (const file of eventFiles) {
    const command = require(`./events/${file}`);
    dcClient.events.set(command.name, command);
}
for (const file of slashCommandFiles) {
    //const command = require(`./dc_commands/_slash/commandUse/${file}`);
    const command = require(`./dc_commands/slash/${file}/index`);
    dcClient.slashCommands.set(command.name, command);
}

module.exports.dcClient = dcClient;

(async () => {
    try {
        await dcClient.login(process.env.dcToken);
        await connectE4kClient();
    } catch (e) {
        console.error(e)
    }
})()
