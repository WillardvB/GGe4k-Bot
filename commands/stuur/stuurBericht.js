module.exports = {
	name: 'stuur bericht',
	description: 'Stuurt het bericht wat je wil!',
  aka: '`stuur message`, `stuur mess`, `stuur b`, `stuur m`',
  format: '`gge stuur bericht [kanaal] [bericht]`',
  voorbeeld: '`gge stuur bericht `<#882701026862452778>` Ik laat de bot dit sturen zonder dat iemand weet wie ik ben`',
	execute(client, message, args) {
    stuurBericht(client, message, args);
  }
}

function stuurBericht(client, message, args){
  let kanaalID = args.shift().trim();
  if(kanaalID.startsWith("<#") && kanaalID.endsWith(">")){
    kanaalID = kanaalID.slice(2, -1).trim();
    const kanaal = client.channels.cache.find(k => k.id == kanaalID)
    if(kanaal != null){
      let inhoud = "";
      for(let i = 0; i < args.length; i++)
      {
        inhoud += args[i] + " ";
      }
      inhoud = inhoud.trim();
      kanaal.send({content: inhoud})
        .then(() => {
          message.reply({content: "het bericht is verzonden"});
        })
        .catch(e => {
          message.reply({content: "Er is iets niet goed gegaan: "+e});
        })
    }
    else
    {
      message.reply({content: 'Ik heb het kanaal niet kunnen vinden!'});
    }
  }
  else
  {
    message.reply({content: 'Geef een geldig kanaalverwijzing op beginnend met #!'});
  }
}