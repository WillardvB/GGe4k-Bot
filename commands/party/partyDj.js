const mention = require('./../../tools/mention.js');
const rollen = require('./../../data/rollen.json');

module.exports = {
    name: 'party dj',
    description: 'geeft de opgegevens leden de DJ-rol',
    format: '`gge party dj [dj1] ([dj2]) ([dj..])`',
    async execute(client, message, args) {
        let users = [];
        for (let i = 0; i < args.length; i++) {
            const user = mention.getUser(client, args[i]);
            if (user != null) {
                users.push(user);
            }
        }
        if (users.length == 0) {
            return message.reply('Geef leden-mentions op');
        }
        setDJs(message, users);
    }
}

function setDJs(message, users) {
    const guild = message.channel.guild;
    const djRol = guild.roles.cache.get(rollen.server.dj);
    for (let a = 0; a < users.length; a++) {
        const member = guild.members.cache.find(member => member.id == users[a].id);
        member.roles.add(djRol, 'Partyy');
    }
    const disbot = guild.roles.cache.get(rollen.server.disbot).members.first();
    disbot.roles.add(djRol, 'Partyy');
}