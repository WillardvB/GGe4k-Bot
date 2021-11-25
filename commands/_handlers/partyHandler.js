const rechten = require('./../../tools/rechten.js');

module.exports = {
	name: 'party',
	description: 'Regelt dingen voor huidige party!',
  adminFunc: true,
	execute(client, message, args) {
  if(message.channel.guild == null){
    return;
  }
    if(rechten.isGeenAdmin(message.channel.guild.members.cache.get(message.author.id))){
      return;
    }
    let dataSoort = args.shift()
    if(dataSoort == 'stop' || dataSoort == 's'){
      client.partyCommands.get("party stop").execute(client, message, args);
    }
    else if(dataSoort == 'dj' || dataSoort == 'djs'){
      client.partyCommands.get("party dj").execute(client, message, args);
    }
    else
    {
      message.reply({content: "Geen geldig party command."});
    }
  }
}