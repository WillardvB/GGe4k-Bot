const {MessageEmbed} = require("discord.js");
const formatDuration = require('./../tools/time.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const kanalen = require('./../data/kanalen.json');

module.exports = {
	name: 'messageDelete',
	description: 'Regelt messageDelete event',
	execute(client, message) {
    if(
      message.author.bot ||
      message.guild.id != kanalen.nlserver.id ||
      message.channel.id == kanalen.nlserver.tekst.admins ||
      message.channel.id == kanalen.nlserver.tekst.bottest
      )
    {
      return;
    }
    else if(
      message.content.toLowerCase().startsWith('gge') ||
      message.content.toLowerCase().startsWith('pls') ||
      message.content.startsWith('!')
      )
    {
      return;
    }
    let output = new MessageEmbed()
      .setTitle("Verwijderd bericht")
      .setColor('FF0000')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter(footerTekst, footerAfbeelding)
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      );
    naarOutput(client, message, output);
  }
}

async function naarOutput(client, message, embed)
{
  if (message.content != '') {
    embed.addField('Inhoud', message.content);
  }
  if (message.embeds[0] != null) {
    if (message.embeds[0].title != null) {
      embed.addField('Embed titel', message.embeds[0].title);
    }
    if (message.embeds[0].description != null) {
      embed.addField('Embed omschrijving', message.embeds[0].description);
    }
  }
  embed
    .addField('Eigenaar', message.author.username + '#' + message.author.discriminator + ' (<@' + message.author.id + '>)')
    .addField('Server', message.guild.name)
    .addField('Kanaal', "<#" + message.channel + ">")
    .addField('Gestuurd op', formatDuration.timestampToDate(message.createdTimestamp, "d en t"));
  var files = '';
  if (message.attachments) {
    let attachments = message.attachments;
    attachments.forEach(file => {
      files += file.proxyURL + '\n';
    });
  }
  if (files != '') {
    embed.addField('bijlagen', files);
  }
  if(message.editedTimestamp >= 1000000){
    embed.addField('Gewijzigd op', formatDuration.timestampToDate(message.editedTimestamp));
  }
  embed.addField('Verwijderd op', formatDuration.timestampToDate(Date.now()));
  const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();
	if (deletionLog)
  {
    const { executor, target } = deletionLog;
    if (target.id === message.author.id)
    {
      embed.addField('Verwijderd door', executor.tag + " (<@" + executor.id + ">)");
    }
  }
  client.channels.cache.find(channel => channel.id == kanalen.nlserver.tekst.logs).send({embeds:[embed]}).catch(console.log);
}