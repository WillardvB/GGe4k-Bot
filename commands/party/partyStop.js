const number = require('./../../tools/number.js');

module.exports = {
  name: 'party stop',
  description: 'stopt de party na de opgegeven minuten: kanalen en dj rollen worden weer weg gehaald',
  format: '`gge party stop [minuten]`',
	async execute(client, message, args) {
    if(number.isNum(args[0]))
    {
      message.reply(`De kanalen worden over ${args[0]} minuten verwijderd`);
      setTimeout(function() {
        verwijderActievePartyKanalen(client, message, args);
      }, args[0]*60000)
    }
    else
    {
      message.reply('geef resterende party minuten op');
    }
  }
}

function verwijderActievePartyKanalen(client, message) {
  
  const guild = message.channel.guild;
  const category = guild.channels.cache.find(channel => channel.name == 'party');
  if (category != null) {
    category.delete();
  }
  const djKanaal = guild.channels.cache.find(channel => channel.name == 'dj_controller');
  if (djKanaal != null) {
    djKanaal.delete();
  }
  const musicChannel = guild.channels.cache.find(channel => channel.name.toLowerCase() == 'disco');
  if (musicChannel != null) {
    musicChannel.delete();
  }
  const chatChannel = guild.channels.cache.find(channel => channel.name.toLowerCase() == 'partychat');
  if (chatChannel != null) {
    chatChannel.delete();
  }
  const djRol = guild.roles.cache.find(role => role.name.toLowerCase() == 'dj');
  djRol.members.map(m=>m.roles.remove(djRol, 'einde party').catch(console.log));
  message.reply('De partykanalen zijn verwijderd en de DJs weer werkloos!');
}