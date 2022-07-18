const fs = require('fs');
const formatDate = require('./../../tools/time.js');
let geplandePartys = require('./../../data/geplandePartys.json');

module.exports = {
	name: 'plan party',
	description: 'Regelt de kanalen voor een party op het gekozen moment!',
	aka: '`plan p`',
	format: '`gge plan party [datum] [tijd]`',
	voorbeeld: '`gge plan party 2021-12-31 19:59:59`, `gge plan party 31-12-2021 20:00`',
	execute(client, message, args) {
		geplandePartys = require('./../../data/geplandePartys.json');
		planBericht(client, message, args);
	}
}

function planBericht(client, message, args) {
	if (args.length < 2) {
		return message.reply({
			content:
				'Geef meer gegevens:\n`gge plan party [datum] [tijd]`'
		});
	}
	const datum = args.shift();
	const tijd = args.shift();
	const timestamp = formatDate.dateToTimestamp(datum, tijd);
	if (isNaN(timestamp)) {
		return message.reply({ content: "Geef een geldige datum en tijd op!" });
	}
	const guildID = message.channel.guild.id;
	var party = {
		guildID: guildID,
		timestamp: timestamp
	};
	geplandePartys.partys.push(party);
	try {
		fs.writeFileSync(
			'/app/data/geplandePartys.json',
			JSON.stringify(geplandePartys, null, 2),
			'utf8'
		);
		message.reply({
			content:
				'De party wordt verzorgt om ' + formatDate.timestampToDate(timestamp - 7200000)
		});
	} catch (err) {
		console.log('An error has ocurred when saving the file.');
	}
}