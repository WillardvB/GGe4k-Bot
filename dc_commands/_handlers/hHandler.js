const rollen = require('./../../data/rollen.json');
const kanalen = require('./../../data/kanalen.json');
const rechten = require('./../../tools/rechten.js');

module.exports = {
    name: 'h',
    nietInHelp: true,
    execute(client, message, args) {
        if (message.channel.guild == null) {
            return;
        }
        if (rechten.isGeenMod(message.channel.guild.members.cache.get(message.author.id))) {
            return;
        }
        let dataSoort = args.shift();
        if (dataSoort == null) {
            return;
        }
        dataSoort = dataSoort.trim();
        if (dataSoort == "admin" || dataSoort == "adm") {
            stuurHulpBericht(message, rollen.server.admin);
        }
        else if (dataSoort == "mod" || dataSoort == "moderator") {
            stuurHulpBericht(message, rollen.server.moderator);
        }
        else if (dataSoort == "srmod" || dataSoort == "srmoderator" || dataSoort == "smod" || dataSoort == "srm") {
            stuurHulpBericht(message, rollen.server.srModerator);
        }
        else if (dataSoort == "all" || dataSoort == "a") {
            stuurHulpBericht(message, '@everyone');
        }
    }
};

function stuurHulpBericht(message, rol) {
    if (rol != "@everyone") {
        rol = "<@&" + rol + ">";
    }
    var kanaal = message.guild.channels.cache.find(channel => channel.id == kanalen.nlserver.tekst.moderators);
    kanaal.send({ content: rol + ", assistentie gevraagd in kanaal <#" + message.channel.id + ">" });
}