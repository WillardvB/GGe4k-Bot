const rechten = require('./../../tools/rechten.js');
const stuurGeplandBerichtJS = require('./../plan/stuurGeplandBericht.js');
const regelPartyKanalenJS = require('./../plan/regelPartyKanalen.js');

module.exports = {
	name: 'plan',
	description: 'Plant party\'s en berichten!',
  modFunc: true,
	execute(client, message, args) {
    if(args == null)
    {
      geplandeBerichtenHandler(client);
      geplandeFeestenHandler(client);
    }
    else
    {
      if(message.channel.guild == null){
        return;
      }
      if(rechten.isGeenMod(message.channel.guild.members.cache.get(message.author.id))){
        return;
      }
      let dataSoort = args.shift();
      if(dataSoort == 'bericht' || dataSoort == 'message' || dataSoort == 'mess' || dataSoort == 'b' || dataSoort == 'm'){
        client.planCommands.get("plan bericht").execute(client, message, args);
      }
      else if(dataSoort == 'party' || dataSoort == 'p'){
        client.planCommands.get("plan party").execute(client, message, args);
      }
      else
      {
        message.reply({content: "Geen geldig plan command."});
      }
    }
  }
}

function geplandeBerichtenHandler(client){
  stuurGeplandBerichtJS.execute(client);
}

function geplandeFeestenHandler(client){
  regelPartyKanalenJS.execute(client);
}