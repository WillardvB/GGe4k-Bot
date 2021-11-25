module.exports = {
	name: 'stuur embed',
	description: 'Stuurt de embed die je wil!',
  aka: '`stuur e`',
  format: '`gge stuur embed [kanaal] [{embedOpties}]` [zie hier voor alle embedOpties](https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object)',
  voorbeeld: '`gge stuur embed `<#882701026862452778>` {"title": "Een titel", "description": "Je omschrijving, een hele mooie omschrijving", "color": "#00FF00"}`',
	execute(client, message, args) {
    stuurEmbed(client, message, args);
  }
}

function stuurEmbed(client, message, args) {
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
      if(!inhoud.startsWith("{") || !inhoud.endsWith("}"))
      {
        return message.reply({content: 'embedOptions moeten in volgende format zijn: `{"soort": "wat soort moet zijn", "andere soort": "andere soort inhoud"}`\nLet op dat je alle soorten en waarden begint en eindigt met " en niet met \''});
      }
      inhoud = JSON.parse(inhoud);
      kanaal.send({embeds: [inhoud]})
        .then(()=>{
          message.reply({content: "Het embed is verzonden"});
        })
        .catch(e=>{
          message.reply({content: "Er is iets niet goed gegaan: "+ e});
        });
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