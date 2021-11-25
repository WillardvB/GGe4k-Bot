const fs = require('fs');
let geplandeBerichten;

module.exports = {
	async execute(client) {
    geplandeBerichten = require('./../../data/geplandeBerichten.json');
    const nu = Date.now();
    for (var i = 0; i < geplandeBerichten.berichten.length; i++) {
      await stuurGeplandBericht(client, i, nu);
    }
  }
}

function stuurGeplandBericht(client, i, nu) {
	const bericht = geplandeBerichten.berichten[i];
	if (bericht.timestamp - (nu + 7200000) < 0) {
		if (bericht.guildID == '') {
			return;
		}
		var doelwitKanaal = bericht.kanaal;
    const server = client.guilds.cache.find(guild => guild.id == bericht.guildID);
		const chann = server.channels.cache.find(channel => channel.id === bericht.kanaalID);
		chann.messages.fetch(bericht.berichtID)
			.then(msg => {
        if (doelwitKanaal != null) {
          kanaal = client.channels.cache.find(
            channel => channel.id === doelwitKanaal
          );
          if (!kanaal) {
            return;
          }
          let teSturenBericht;
          if(msg.content != "" && msg.content != null){
            teSturenBericht = {content: msg.content, embeds: msg.embeds};
          }else{
            teSturenBericht = {embeds: msg.embeds};
          }
          client.channels.cache
            .find(channel => channel.id == doelwitKanaal)
            .send(teSturenBericht);
        }
			})
      .then(() => {
        geplandeBerichten.berichten.splice(i, 1);
        try {
          fs.writeFileSync(
            'E4K_NL_bot/data/geplandeBerichten.json',
            JSON.stringify(geplandeBerichten, null, 2),
            'utf8'
          );
        } catch (err) {
          console.log('An error has ocurred when saving the file.');
        }
      });
	}
}