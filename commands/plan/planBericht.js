const fs = require('fs');
const formatDate = require('./../../tools/time.js');
let geplandeBerichten = require('./../../data/geplandeBerichten.json');

module.exports = {
	name: 'plan bericht',
	description: 'Stuurt het bericht, waarop je reageert, op het gekozen moment in het gekozen kanaal!',
  aka: '`plan message`, `plan mess`, `plan b`, `plan m`',
  format: '`gge plan bericht [kanaal] [datum] [tijd]`',
  voorbeeld: '`gge plan bericht `<#882701026862452778>` 2021-12-31 23:01:02`, `gge plan bericht `<#882701026862452778>` 31-12-2021 15:07`',
	execute(client, message, args) {
    geplandeBerichten = require('./../../data/geplandeBerichten.json');
    planBericht(client, message, args);
  }
}

function planBericht(client, message, args) {
	if (message.reference == null) {
		return message.reply({content:
			'antwoord op een bericht met `gge plan bericht` om dat bericht op een bepaald tijdstip te sturen'
    });
	}
	if (args.length < 3) {
		return message.reply({content:
			'Geef meer gegevens:\ngge plan bericht [kanaal] [datum] [tijd ]'
    });
	}
  let doelwit = args.shift();
	if (!(doelwit.startsWith('<#') && doelwit.endsWith('>'))) {
		return message.reply({content:
			'Geef een geldig kanaalverwijzing op beginnend met #'
  });
	}
  const datum = args.shift();
  const tijd = args.shift();
  const timestamp = formatDate.dateToTimestamp(datum, tijd);
  if(isNaN(timestamp)){
    return message.reply({content:"Geef een geldige datum en tijd op!"});
  }
	var guildID = message.reference.guildId;
	var kanaalID = message.reference.channelId;
	var berichtID = message.reference.messageId;
	doelwit = doelwit.slice(2, -1).trim();
  kanaal = client.channels.cache.find(channel => channel.id === doelwit);
  if (kanaal == null) {
    return message.reply({content:
      'Geef een geldig kanaal op: Ik kan het kanaal niet vinden..'
    });
  }
  var bericht = {
    guildID: guildID,
    kanaalID: kanaalID,
    berichtID: berichtID,
    kanaal: kanaal.id,
    timestamp: timestamp
  };
	geplandeBerichten.berichten.push(bericht);
	try {
		fs.writeFileSync(
			__dirname + '/data/geplandeBerichten.json',
			JSON.stringify(geplandeBerichten, null, 2),
			'utf8'
		);
		message.reply({content:
			'Het bericht wordt verzonden op ' + formatDate.timestampToDate(timestamp - 7200000)
    });
	} catch (err) {
		console.log('An error has ocurred when saving the file.');
	}
}