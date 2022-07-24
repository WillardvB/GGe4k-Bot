const rechten = require('./../../tools/rechten.js');
const config = require('./../../data/myConfig.json');

module.exports = {
    name: 'stuur',
    description: 'Stuurt alle soorten berichten!',
    modFunc: true,
    execute(client, message, args) {
        if (message.channel.guild == null) {
            return;
        }
        if (rechten.isGeenMod(message.channel.guild.members.cache.get(message.author.id))) {
            return;
        }
        args = message.content.slice(config.prefix.length).trim().split(/ +/);
        args.shift();
        let dataSoort = args.shift().toLowerCase();
        if (dataSoort == 'bericht' || dataSoort == 'message' || dataSoort == 'mess' || dataSoort == 'b' || dataSoort == 'm') {
            client.stuurCommands.get("stuur bericht").execute(client, message, args);
        }
        else if (dataSoort == 'embed' || dataSoort == 'e') {
            client.stuurCommands.get("stuur embed").execute(client, message, args);
        }
        else {
            message.reply({ content: "Geen geldig stuur command." });
        }
    }
}