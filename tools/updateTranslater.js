const kanalen = require('./../data/kanalen.json');
const translate = require('@vitalets/google-translate-api');
const jsdom = require('jsdom');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageEmbed } = require('discord.js');
let kanaal;

module.exports = {
    vertaalUpdate: function (client) {
        return krijgNieuweUpdateNotesPagina(client);
    }
};

function krijgNieuweUpdateNotesPagina(client) {
    kanaal = client.channels.cache.find(channel => channel.id == kanalen.nlserver.tekst.onvertaalde_updates);
    kanaal.send({ content: "Ik ga kijken wat er allemaal is te zien op het forum!" });
    fetch("https://community.goodgamestudios.com/fourkingdoms/en/categories/official-announcements-en")
        .then(res => {
            res.text().then(html => {
                var doc = new jsdom.JSDOM(html).window.document;
                var listItems = doc.getElementsByTagName('li');
                var tot5 = 0;
                loopDoorDeForumNotes(client, 12, listItems, tot5);
            })
        })
}

function loopDoorDeForumNotes(client, i, listItems, tot5) {
    if (listItems[i].querySelector('a') != null) {
        var aObject = listItems[i].querySelector('a');
        bronHref = aObject.href;
        filterUpdateInfo(client, bronHref);
        if (tot5 < 5) {
            setTimeout(function () {
                loopDoorDeForumNotes(client, i + 1, listItems, tot5 + 1);
            }, 5 * 1000);
        }
    }
}

function filterUpdateInfo(client, url) {
    fetch(url).then(res2 => {
        res2.text().then(html2 => {
            var doc2 = new jsdom.JSDOM(html2).window.document;
            var footerTekst = '© E4K NL server';
            var footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
            var titel = getTitle(doc2);
            vertaalUpdate(titel, function (nieuweTitel) {
                titel = nieuweTitel;
                var onvertaaldeTitel = doc2.querySelector('.Item-Body h1');
                if (onvertaaldeTitel == null) {
                    onvertaaldeTitel = "";
                } else {
                    onvertaaldeTitel = onvertaaldeTitel.textContent;
                }
                omschrijvingEnVelddata = getDescription(doc2, onvertaaldeTitel);
                var berichtOmschrijving = omschrijvingEnVelddata[0].textContent;
                if (berichtOmschrijving == null) {
                    berichtOmschrijving = omschrijvingEnVelddata[0];
                }
                var veldData = [...omschrijvingEnVelddata];
                veldData.shift();
                vertaalUpdate(berichtOmschrijving, function (
                    nieuweOmschrijving
                ) {
                    berichtOmschrijving = nieuweOmschrijving;
                    var imagesInUpdateNode = doc2
                        .querySelector('.Item-Body')
                        .getElementsByTagName('img');
                    var auteurAObject = doc2.querySelector('.Author a');
                    var auteurNaam = auteurAObject.title;
                    var auteurAfbeelding = auteurAObject.querySelector('img').src;
                    var auteurLink = 'https://community.goodgamestudios.com' + auteurAObject.href;
                    var embed = new MessageEmbed()
                        .setTitle(titel)
                        .setURL(bronHref)
                        .setAuthor(auteurNaam, auteurAfbeelding, auteurLink)
                        .setDescription(berichtOmschrijving)
                        .setImage(imagesInUpdateNode[0].src)
                        .setFooter(footerTekst, footerAfbeelding)
                        .setTimestamp()
                        .setThumbnail(footerAfbeelding)
                        .setColor('05af49');
                    var vertaaldeVelden = ['ha'];
                    vertaaldeVelden.pop();
                    veldData = veldData.filter(function (el) {
                        return el.textContent != "";
                    });
                    if (veldData.length == 0)
                    {
                        kanaal.send({ embeds: [embed] });
                    }
                    else
                    {
                        vertaalUpdateVelden(
                            veldData,
                            embed,
                            vertaaldeVelden,
                            function (vertaaldeEmbedVelden) {
                                embed.fields = vertaaldeEmbedVelden;
                                kanaal.send({ embeds: [embed] });
                            }
                        )
                    }
                })
            })
        })
    })
}

function getTitle(doc) {
    var tweedeTitel = doc.querySelector('.Item-Body h1');
    if (tweedeTitel == null) {
        tweedeTitel = "";
    }
    else {
        tweedeTitel = ': ' + tweedeTitel.textContent;
    }
    var hoofdTitel = doc.querySelector('h1').textContent;
    return hoofdTitel + tweedeTitel;
}

function getDescription(doc, title) {
    var tmpBerichtOmschrijving = doc.querySelector('.Item-Body div').textContent.trim();
    title = title.trim();
    if (title != "") {
        if (tmpBerichtOmschrijving.startsWith(title)) {
            omschrijvingDelen = tmpBerichtOmschrijving.split(title);
            tmpBerichtOmschrijving = "";
            for (o = 0; o < omschrijvingDelen.length; o++) {
                tmpBerichtOmschrijving += omschrijvingDelen[o];
            }
            tmpBerichtOmschrijving = tmpBerichtOmschrijving.trim();
        }
    }
    if (tmpBerichtOmschrijving.length < 500) {
        return [tmpBerichtOmschrijving];
    }
    var tmpVeldData = doc.querySelectorAll('.Item-Body div p');
    tmpVeldData = [].slice.call(tmpVeldData);
    var preVeld = doc.querySelector('.Item-Body div div b');
    if (preVeld) {
        tmpVeldData = [preVeld, ...tmpVeldData];
    }
    if (tmpVeldData.length == 0) {
        var tmpVeldData = doc.querySelector('.Item-Body div div');
        if (tmpVeldData.length == 0 || tmpVeldData[0] == null) {
            tmpVeldData = ['ha'];
            tmpVeldData.pop();
        }
        else
        {
            if (tmpBerichtOmschrijving.trim().startsWith(tmpVeldData[0].textContent.trim())) {
                tmpBerichtOmschrijving = tmpVeldData.shift();
            }
            else {
                tmpBerichtOmschrijving = tmpBerichtOmschrijving.split(tmpVeldData[0].textContent)[0];
            }
        }
    }
    else {
        if (tmpVeldData[0] == null) {
            tmpVeldData = ['ha'];
            tmpVeldData.pop();
        }
        else {
            if (tmpBerichtOmschrijving.trim().startsWith(tmpVeldData[0].textContent.trim())) {
                tmpBerichtOmschrijving = tmpVeldData.shift();
                tmpBerichtOmschrijving = tmpBerichtOmschrijving.textContent.trim();
                console.log(tmpBerichtOmschrijving);
            }
            else {
                tmpBerichtOmschrijving = tmpBerichtOmschrijving.split(tmpVeldData[0].textContent)[0];
            }
        }
    }
    return [tmpBerichtOmschrijving, ...tmpVeldData];
}

function vertaalUpdate(tekst, callback, outputFormat) {
    translate(tekst, { from: 'en', to: 'nl' }).then(res => {
        if (res.text.didYouMean) {
            teVertalenTekst = res.text.value;
            teVertalenTekst = teVertalenTekst.replace('[', '').replace(']', '');
            translate(teVertalenTekst, { to: 'nl' }).then(res2 => {
                outputFormat = res2.text;
                callback(outputFormat);
            });
        } else {
            outputFormat = res.text;
            callback(outputFormat);
        }
    });
}

function vertaalUpdateVelden(
    veldData,
    embed,
    vertaaldeVelden,
    callback,
    outputFormat
) {
    vertaalTekst = veldData[vertaaldeVelden.length].textContent;
    if (vertaalTekst == "" || vertaalTekst == null) {
        console.log("Geen velden!");
        callback({});
        return;
    }
    vertaalUpdate(vertaalTekst, function (tekst) {
        vertaaldeVelden.push(tekst);
        if (veldData.length == vertaaldeVelden.length) {
            for (v = 0; v < vertaaldeVelden.length; v++) {
                var veldTitel = vertaaldeVelden[v];
                var tekst = vertaaldeVelden[v + 1];
                if (v + 2 < vertaaldeVelden.length) {
                    if (vertaaldeVelden[v + 2].length > 50 || tekst == '') {
                        tekst = tekst + '\n' + vertaaldeVelden[v + 2];
                        v += 1;
                    }
                }
                v += 1;
                if (tekst != null) {
                    embed.addField("" + veldTitel, tekst + "");
                }
            }
            callback(embed.fields);
        } else {
            vertaalUpdateVelden(
                veldData,
                embed,
                vertaaldeVelden,
                callback,
                outputFormat
            );
        }
    });
}