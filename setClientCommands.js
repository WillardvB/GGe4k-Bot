const fs = require('fs');
const {Collection} = require('discord.js');

module.exports = {
	execute(client) {
    setCommands(client);
  }
}

function setCommands(client){
    client.events = new Collection();
    client.commands = new Collection();
    client.slashCommands = new Collection();
    client.helpCommands = new Collection();
    client.gebouwCommands = new Collection();
    client.rrCommands = new Collection();
    client.titelCommands = new Collection();
    client.planCommands = new Collection();
    client.partyCommands = new Collection();
    client.stuurCommands = new Collection();

    const eventFiles = fs.readdirSync(__dirname+'/events').filter(file => file.endsWith('.js'));
    const commandFiles = fs.readdirSync(__dirname +'/commands/_handlers').filter(file => file.endsWith('.js'));
    const slashCommandFiles = fs.readdirSync(__dirname +'/commands/_slash/commandUse').filter(file => file.endsWith('.js'));
    const helpCommandFiles = fs.readdirSync(__dirname +'/commands/help').filter(file => file.endsWith('.js'));
    const gebouwCommandFiles = fs.readdirSync(__dirname +'/commands/gebouw').filter(file => file.endsWith('.js'));
    const rrCommandFiles = fs.readdirSync(__dirname +'/commands/roofridder').filter(file => file.endsWith('.js'));
    const titelCommandFiles = fs.readdirSync(__dirname +'/commands/titel').filter(file => file.endsWith('.js'));
    const planCommandFiles = fs.readdirSync(__dirname +'/commands/plan').filter(file => file.endsWith('.js'));
    const partyCommandFiles = fs.readdirSync(__dirname +'/commands/party').filter(file => file.endsWith('.js'));
    const stuurCommandFiles = fs.readdirSync(__dirname +'/commands/stuur').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
    const command = require(`./events/${file}`);
    client.events.set(command.name, command);
    }
    for (const file of slashCommandFiles) {
    const command = require(`./commands/_slash/commandUse/${file}`);
    client.slashCommands.set(command.name, command);
    }
    for (const file of commandFiles) {
    const command = require(`./commands/_handlers/${file}`);
    client.commands.set(command.name, command);
    }
    for (const file of helpCommandFiles) {
    const command = require(`./commands/help/${file}`);
    client.helpCommands.set(command.name, command);
    }
    for (const file of gebouwCommandFiles) {
    const command = require(`./commands/gebouw/${file}`);
    client.gebouwCommands.set(command.name, command);
    }
    for (const file of rrCommandFiles) {
    const command = require(`./commands/roofridder/${file}`);
    client.rrCommands.set(command.name, command);
    }
    for (const file of titelCommandFiles) {
    const command = require(`./commands/titel/${file}`);
    client.titelCommands.set(command.name, command);
    }
    for (const file of planCommandFiles) {
    const command = require(`./commands/plan/${file}`);
    client.planCommands.set(command.name, command);
    }
    for (const file of partyCommandFiles) {
        const command = require(`./commands/party/${file}`);
        client.partyCommands.set(command.name, command);
    }
    for (const file of stuurCommandFiles) {
        const command = require(`./commands/stuur/${file}`);
        client.stuurCommands.set(command.name, command);
    }
}