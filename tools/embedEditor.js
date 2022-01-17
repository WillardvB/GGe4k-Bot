const kanalen = require('./../data/kanalen.json');
const rollen = require('./../data/rollen.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	stuurRegelsBericht: function (client) {
		return stuurWelkomstBerichtMetRegels(client);
	},
	stuurReactieRollenBericht: function (client) {
		return wijzigReactierollenBericht(client);
    }
};

function stuurWelkomstBerichtMetRegels(client) {
	var footerTekst = '© E4K NL server';
	var footerAfbeelding =
		'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
	var embed = new MessageEmbed()
		.setTitle('**Welkom op de E4K/Empire NL Community Discordserver!**')
		.setDescription(
			'Deze Discordserver is er voor de community van de Nederlandse GGE en E4K server. De server verbetert het contact tussen bgs en hier kan iedereen zijn/haar tips & tricks delen. Voordat je verder gaat, lees eerst even dit bericht.' + '\n' +
			'\n' +
			'Mocht je problemen ondervinden tijdens het gebruik van de server, contacteer een <@&' + rollen.server.moderator + '>. Zij zullen je verder helpen.' + '\n' +
			'\n' +
			'Hulpvolle links:' + '\n' +
			'- Discord uitnodiging: https://discord.gg/w6YSB4kHQu' + '\n' +
			'- GGE support: https://support.goodgamestudios.com/'
		)
		.setColor('#02c2e6')
		.setFooter(footerTekst, footerAfbeelding)
		.setThumbnail(footerAfbeelding)
		.setTimestamp()
		.setAuthor('E4K/Empire NL', footerAfbeelding)
		.addField(
			'**Regels**',
			'Aan alle onderstaande regels moet voldaan worden tijdens je lidmaatschap van de server. Overtreed je een regel kunnen hier (permanente) consequenties aan vasthangen. Bij binnenkomst heb je deze regels al geaccepteerd waardoor je volledige toegang tot de server hebt gekregen.'
		)
		.addField(
			'**1. Omgang**',
			'1.1 Enige vorm van pesten, intimideren of bedreigen is **VERBODEN**. Krijgen wij een melding dat je dit toch doet wordt je zonder pardon permanent van de server verbannen.\n' +
			'1.2 Er is een verschil tussen klieren/plagen/kloten en pesten. Elkaar plagen is toegestaan maar neem de verantwoordelijkheid, zodat het niet tot pesten overgaat.\n' +
			'1.3 Voel je je gepest, geïntimideerd of bedreigd? Neem dan z.s.m. contant op met een <@&' + rollen.server.moderator + '>. Zij gaan de kwestie oplossen. Zorg er ook voor dat je dit kunt aantonen (door bijv. screenshots) want bij gebrek aan bewijs kan het moderator team helaas niks voor je betekenen.'
		)
		.addField(
			'**2. NSFW content**',
			'2.1 NSFW (not suitable for work) content is toegestaan op de server. Dit enkel in het <#' + kanalen.nlserver.tekst.nsfw + '> kanaal waar je toegang tot kunt krijgen door de rol <@&' + rollen.server.NSFW + '> te activeren in <#' + kanalen.nlserver.tekst.nsfw + '>.\n' +
			'2.2 Op het moment dat je de rol <@&' + rollen.server.NSFW + '> activeert ga je er mee akkoord 18+ content te willen zien. De server is niet verantwoordelijk voor enige overgehouden trauma\'s en/of letsels.\n' +
			'2.3 Iedereen is vrij elke vorm van content te plaatsen in <#' + kanalen.nlserver.tekst.nsfw + '>. Er zit geen filter op het kanaal. Je hebt immers geaccepteerd dat je deze vormen van content wilt zien.'
		)
		.addField(
			'**3. Kanalen**',
			'3.1 Gebruik de kanalen waar ze voor bedoeld zijn. In de kanaalbeschrijving staat steeds waar ze voor bedoeld zijn. Dit om chaos te voorkomen. Berichten die dan ook niet thuishoren in een kanaal worden verwijderd.'
		)
		.addField(
			'**4. Rollen**',
			'4.1 Bepaalde rollen kunnen verkregen worden door op berichten te reageren met een emoji in <#' + kanalen.nlserver.tekst.reactierollen + '>. Vragen om een rol heeft geen zin en deze zul je ook niet ontvangen.\n' +
			'4.2 Je bent zelf verantwoordelijk voor de rollen die je draagt. Draag je een rol die je extra permissies geeft is het niet de bedoeling dat je daar misbruik van maakt. Gebeurt dat wel wordt de rol van je afgepakt.'
		)
		.addField(
			'**5. Namen**',
			'5.1 Ieder lid kan zijn eigen naam veranderen. Er wordt aangeraden die te veranderen naar je in-game naam om communicatie te bevorderen. Zo weet een ander beter met wie hij/zij spreekt.\n' +
			'5.2 Andermans naam of andere namen gebruiken die tegen andere regels ingaan, zoals het gebruik van scheldwoorden, zijn niet toegestaan. Hiervoor zul je van de server worden verwijderd.'
		)
		.addField(
			'**6. Algemeen**',
			'6.1 Wanneer je bepaalde permissies hebt kun je aanpassingen doen aan de server. Dit is niet toegestaan zonder toestemming van minstens 1 rang hoger dan jijzelf.\n' +
			'6.2 Een <@&' + rollen.server.moderator + '> of hoger zijn op elk willekeurig moment gemachtigd een lid van de server te muten, kicken, bannen of te degraderen wanneer daar een geldige reden voor is.\n' +
			'6.3 Leden ongewild persoonlijk berichten is niet toegestaan. Dit dient echter onderling opgelost te worden. Een optie hiervoor is *\'berichten van serverleden toestaan\'* uit zetten.\n' +
			'6.4 Luister altijd naar instructies van staffleden. Je herkent ze aan hun rang op de discord server. Een overzicht van de staffleden is te vinden in <#' + kanalen.nlserver.tekst.team + '>.\n' +
			'6.5 Alles wat op de discord server gebeurt staat los van wat in de game gebeurt, en andersom. Mocht op de discord iets gebeuren is het aan de bgs zelf of ze ook acties in-game gaan ondernemen.\n' +
			'6.6 Het verspreiden van elk soort privé gegevens van andere leden is verboden, dit zal resulteren in een ban.'
		)
		.addField(
			'**7. Overig**',
			'7.1 De server regels zullen regelmatig veranderd worden. Wanneer dat gebeurt zal dat van te voren medegedeeld worden middels een mededeling in het <#' + kanalen.nlserver.tekst.mededelingen + '> kanaal met een @everyone tag.\n' +
			'7.2 Op de server gelden ook Discords Terms of Service and Community Guidelines die je hier kunt vinden: https://discordapp.com/terms https://discordapp.com/guidelines\n' +
			'7.3 Adverteren in welke vorm dan ook is niet toegestaan zonder permissie van een stafflid. Wil je dit wel, vraag dat van te voren.\n'
		);

	client.channels.cache
	.find(channel => channel.id == kanalen.nlserver.tekst.modCommandsSuperbot)
	.messages.fetch("916394001639288833").then(msg => {
		msg.edit({ embeds: [embed] });
	});
}

function wijzigReactierollenBericht(client) {
	var embed = new MessageEmbed()
		.setTitle("Spelrollen")
		.setDescription("Klik een van de onderstaande emojis om de bijbehorende E4K, Empire of mededelingen rol te krijgen!")
		.setColor("#8888FF")
		.setImage("https://images-ext-1.discordapp.net/external/XrVNg9Jx8v3MbIORgpOkMfL1-5Vw-Y2mb6hsXN9AOqw/https/cdn-longterm.mee6.xyz/plugins/embeds/images/882701023846739979/9e93203a362b32e0d8e116e4a278d2328c06a36e483398c3a90356f98f5fe68c.gif")
		.setAuthor("WillardvB", "https://icon-library.com/images/blue-discord-icon/blue-discord-icon-17.jpg")
		.setThumbnail("https://images-ext-1.discordapp.net/external/XrVNg9Jx8v3MbIORgpOkMfL1-5Vw-Y2mb6hsXN9AOqw/https/cdn-longterm.mee6.xyz/plugins/embeds/images/882701023846739979/9e93203a362b32e0d8e116e4a278d2328c06a36e483398c3a90356f98f5fe68c.gif")
		.addField(":mobile_phone: (E4K)", "Klik op deze emoji voor de E4K rol.", false)
		.addField(":desktop: (Empire)", "Klik op deze emoji voor de Empire rol.", false)
		.addField(".:bell:.", "Klik op deze emoji voor de Mededeling rol.", false);
	client.channels.cache
	.find(channel => channel.id == kanalen.nlserver.tekst.reactierollen)
	.messages.fetch("904438373089947730").then(msg => {
		msg.edit({ embeds: [embed] });
	});
}