const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const kanalen = require('./data/kanalen.json');

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/dc_commands/_slash/commandBuild').filter(file => file.endsWith('.js'));

module.exports = {
    execute(client) {
        ////ALLEEN ALS VERKEERD COMMAND de commands resetten
        /*client.application.commands.set([])
          .then(res => {
            console.log(res);*/
        return setSlashCommands(client);
        /*})
        .catch(console.error);*/
    }
}

function setSlashCommands(client) {
    const clientId = client.user.id;
    const guildId = kanalen.nlserver.id;

    for (const file of commandFiles) {
        const command = require(`./dc_commands/_slash/commandBuild/${file}`);
        if (command.data != null) {
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST().setToken(process.env.dcToken);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}