module.exports = {
	name: 'roofridder',
	description: 'Toont al je gewenste roofridderdata! *(Wordt aan gewerkt momenteel)*',
	execute(client, message, args) {
    let dataSoort = args.shift();
    if(dataSoort == null){
      return message.reply({content: "zie `gge help roofridder` voor de roofridder-command mogelijkheden"});
    }
    dataSoort = dataSoort.trim();
    if(dataSoort == "info" || dataSoort == "i"){
      client.rrCommands.get('roofridder info').execute(client, message, args);
      return;
    }else if(dataSoort == "buit" || dataSoort == "b"){
      client.rrCommands.get('roofridder buit').execute(client, message, args);
      return;
    }else{
      message.reply({content: 'typ `gge help roofridder` voor mogelijke commands'});
    }
	},
};