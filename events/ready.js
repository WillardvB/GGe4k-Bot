const kanalen = require('./../data/kanalen.json');
const googleSheet = require('./../data/googleSpreadSheetData.js');
const regels = require('./../tools/regels.js');
let client1;

module.exports = {
	name: 'ready',
	description: 'Regelt ready event',
	execute(client) {
    client1 = client;
    weerOnline(client);
    setInterval(elkeXSec, 1000);
  }
}

function elkeXSec(){
  client1.commands.get("plan").execute(client1);
}

async function weerOnline(client){
  const server = client.guilds.cache.find(guild => guild.id = kanalen.nlserver.id);
  await server.members.fetch();
  await server.channels.cache.forEach(channel => {
    fetchMessagesFrom(client, channel.id, 5);
  })
  await googleSheet.gebouwData(client);
  await googleSheet.titelData(client);
  await googleSheet.rrData(client);
  await googleSheet.rrAttData(client);
  client.guilds.cache.find(guild => guild.id == kanalen.nlserver.id).fetchOwner().then(itsme => {
    itsme.send({content: 'Hey, ik ben weer online! 🙂'});
    client.user.setActivity({ type: "PLAYING", name: `Goodgame Empire (Four Kingdoms)` })
    console.log('Ready!');
  })
  //regels.stuurRegelsBericht(client); //Alleen wanneer aanpassingen nodig zijn deze doen.
}

async function fetchMessagesFrom(client, kanaalID, aantalMsgX100)
{
  const kanaal = client.channels.cache.find(channel => channel.id == kanaalID);
  if(kanaal == null){
    return;
  }
  let options = {limit: 100};
  for(let u = 0; u < aantalMsgX100; u++){
    if(u != 0 && laatsteMessageID != null){
      options.before = laatsteMessageID;
    }
    else if(u != 0 && laatsteMessageID == null){
      return;
    }
    if(kanaal.messages == null){
      return;
    }
    await kanaal.messages.fetch(options)
      .then(msgs => {
        laatsteMessageID = msgs.last().id;
      })
      .catch(e => {
        u = 10000;
        return;
      })
  }
}