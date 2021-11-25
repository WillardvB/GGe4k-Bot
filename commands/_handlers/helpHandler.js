module.exports = {
	name: 'help',
	description: 'Helpt met command gebruik!',
	execute(client, message, args) {
    let dataSoort = args.shift();
    if(dataSoort == null){
      dataSoort = "******";
    }
    dataSoort = dataSoort.trim();
    if(dataSoort == 'gebouw' || dataSoort == "gebouwen" || dataSoort == "g" || dataSoort == "building" || dataSoort == "buildings" || dataSoort == "b")
    {
      client.helpCommands.get('help gebouw').execute(client, message);
      return;
    }
    else if(dataSoort == 'titel' || dataSoort == "title" || dataSoort == "t" || dataSoort == "titels" || dataSoort == "titles")
    {
      client.helpCommands.get('help titel').execute(client, message);
      return;
    }
    else if(dataSoort == 'plan')
    {
      client.helpCommands.get('help plan').execute(client, message);
      return;
    }
    else if(dataSoort == 'party')
    {
      client.helpCommands.get('help party').execute(client, message);
      return;
    }
    else if(dataSoort == 'stuur' || dataSoort == "s" || dataSoort == "send")
    {
      client.helpCommands.get('help stuur').execute(client, message);
      return;
    }
    else if(dataSoort == 'roofridder' || dataSoort == "rr")
    {
      client.helpCommands.get('help roofridder').execute(client, message);
      return;
    }
    else
    {
      client.helpCommands.get('help all').execute(client, message);
      return;
    }
	},
};