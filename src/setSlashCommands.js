const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require('fs');
const kanalen = require('./data/kanalen.json');

const commands = [];
//const commandFiles = fs.readdirSync(__dirname + '/dc_commands/_slash/commandBuild').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync(__dirname + '/dc_commands/slash').filter(file => !file.includes('.'));

module.exports.execute = async function (client) {
    return await setSlashCommands(client);
}


async function setSlashCommands(client) {
    const clientId = client.user.id;
    const guildId = kanalen.nlserver.id;

    for (const file of commandFiles) {
        //const command = require(`./dc_commands/_slash/commandBuild/${file}`);
        const command = require(`./dc_commands/slash/${file}/index`);
        if (command.data != null) {
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST().setToken(process.env.dcToken);
    try {
        console.log('Started refreshing application (/) commands.');
        //await rest.put(Routes.applicationCommands(clientId), {body: commands},);
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands},);
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}