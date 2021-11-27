const kanalen = require('./../data/kanalen.json');
const config = require('./../data/myConfig.json');
const updateTranslator = require('./../tools/updateTranslater.js');

module.exports = {
    name: 'message',
    description: 'Regelt messageCreate event',
    execute(client, message) {
        if (message.channel.id == kanalen.nlserver.tekst.onvertaalde_updates) {
            if (message.content.includes('<#817014369971994645>')) {
                updateTranslator.vertaalUpdate(client, message);
                return;
            }
        }
        if (!message.content.toLowerCase().startsWith(config.prefix)) {
            return;
        }
        var args = message.content.toLowerCase().slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift();
        if (client.commands.has(command)) {
            try {
                client.commands.get(command).execute(client, message, args);
                console.log(command);
            } catch (error) {
                console.error(error);
                message.reply({ content: 'there was an error trying to execute that command!' });
            }
        }
    }
}