const { MessageEmbed } = require("discord.js");
const formatDuration = require('./../tools/time.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const kanalen = require('./../data/kanalen.json');

module.exports = {
    name: 'messageUpdate',
    description: 'Regelt messageUpdate event',
    execute(client, oud, nieuw) {
        //oud, nieuw = oldMessage, newMessage
        if (
            oud.author.bot ||
            oud.guild.id != kanalen.nlserver.id ||
            oud.channel.id == kanalen.nlserver.tekst.admins ||
            oud.channel.id == kanalen.nlserver.tekst.bottest
        ) {
            return;
        }
        else if (
            nieuw.content.toLowerCase().startsWith('gge') ||
            nieuw.content.toLowerCase().startsWith('pls') ||
            nieuw.content.startsWith('!')
        ) {
            return;
        }
        let output = new MessageEmbed()
            .setTitle("Gewijzigd bericht")
            .setColor('FFFF00')
            .setThumbnail(oud.author.displayAvatarURL({ dynamic: true }))
            .setFooter(footerTekst, footerAfbeelding)
            .setAuthor(
                oud.author.username,
                oud.author.displayAvatarURL({ dynamic: true })
            );
        output = naarOutput(oud, nieuw, output);
        if (output == null) {
            return;
        }
        client.channels.cache.find(channel => channel.id == kanalen.nlserver.tekst.logs).send({ embeds: [output] }).catch(console.log);
    }
}

function naarOutput(oud, nieuw, embed) {
    let hetzelfde = true;
    if (oud.content != nieuw.content) {
        if (oud.content != '') {
            embed.addField('Inhoud eerst', oud.content);
        }
        if (nieuw.content != '') {
            embed.addField('Inhoud daarna', nieuw.content);
        }
        hetzelfde = false;
    }
    if (oud.embeds[0] != null && nieuw.embeds[0] != null) {
        if (oud.embeds[0] != nieuw.embeds[0]) {
            if (oud.embeds[0].title != '') {
                embed.addField('Titel embed eerst', oud.embeds[0].title);
            }
            if (nieuw.embeds[0].title != '') {
                embed.addField('Titel embed daarna', nieuw.embeds[0].title);
            }
            if (oud.embeds[0].description != '') {
                embed.addField('Omschrijving embed eerst', oud.embeds[0].description);
            }
            if (nieuw.embeds[0].description != '') {
                embed.addField('Omschrijving embed daarna', nieuw.embeds[0].description);
            }
            hetzelfde = false;
        }
    }
    if (hetzelfde) {
        return null;
    }
    embed
        .addField('Eigenaar', oud.author.username + '#' + oud.author.discriminator + ' (<@' + oud.author.id + '>)')
        .addField('Server', oud.guild.name)
        .addField('Kanaal', '<#' + oud.channel.id + '>')
        .addField('Gestuurd op', formatDuration.timestampToDate(oud.createdTimestamp, "d en t"));
    if (nieuw.editedTimestamp != 0) {
        embed.addField('Gewijzigd op', formatDuration.timestampToDate(nieuw.editedTimestamp, "d en t"));
    }
    return embed;
}