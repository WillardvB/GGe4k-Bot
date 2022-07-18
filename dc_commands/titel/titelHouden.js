const googleSheetsData = require('./../../data/googleSpreadSheetData.js');
const formatNumber = require('./../../tools/number.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const titelInfo = require('./titelInfo.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";
let fameTresholds = [];
let beriTresholds = [];

module.exports = {
	name: 'titel houden',
	description: 'Toont de hoeveelheid score/roem je nodig hebt om je titel x dagen te behouden!',
  aka: '`titel houd`, `titel h`, `titel hold`, `titel keep`, `titel k`',
  format: '`gge titel houden [dagen] [titelnaam/-nummer])`',
  voorbeeld: '`gge titel h 14 kapitein`, `gge titel h 7 23`',
	async execute(client, message, args) {
    const dagen = args.shift();
    var titelnaam = "";
    for(var i = 0; i < args.length; i++)
    {
      titelnaam += args[i].trim() + " ";
    }
    if(dagen == null || titelnaam == "" || titelnaam == " "){
      return message.reply({content: "Geef meer gegevens: `gge titel houden [dagen] [titelnaam/-nummer]`"});
    }
    if(!formatNumber.isNum(dagen)){
      return message.reply({content: "Geef een geldig getal als aantal dagen:\n```gge titel houden [dagen] [titelnaam/-nummer]```"});
    }
    titelnaam = titelnaam.trim();
    const rows = await googleSheetsData.titelData(client);
    if(rows == null){
      return message.reply('De data wordt nog geladen, probeer het over enkele seconden opnieuw');
    }
    if (rows.length) {
      var titelGevonden = false;
      var soort;
      var benodigdVoorTitel = 0;
      if(fameTresholds.length == 0){
        setTresholds(rows);
      }
      rows.map(row => {
        if (row[0].toLowerCase() == titelnaam || row[1] == titelnaam && formatNumber.isNum(titelnaam)) {
          titelGevonden = true;
          soort = row[2];
          if(row[3])
          {
            if(soort == "FAME"){
              soort = "roempunten";
            }
            else if(soort == "FACTION"){
              soort = "berimondscore";
            }
            naarOutput(message, row, dagen, soort);
          }
          else
          {
            titelInfo.output(message, row);
          }
        }
      });
      if (!titelGevonden) {
        return message.reply({content: 
          'ik heb de gevraagde titel niet kunnen vinden. Ga na of je de Nederlandse naam goed hebt doorgeven en probeer het daarna opnieuw. Zie `gge titel namen` voor alle mogelijkheden'
        });
      }
    }
	},
};

function naarOutput(message, row, dagen, soort){
  benodigdeWaarde = bereken(row[3], dagen, soort);
  var meervoudEN = '';
	if (dagen > 1) {
		meervoudEN = 'en';
	}
  dagen = formatNumber.formatNum(dagen);
  benodigdeWaarde = formatNumber.formatNum(benodigdeWaarde);
	var omschrijving = `Om titel **${row[0]}** ` + '`' + `${dagen} dag${meervoudEN}` + '`' + ` te houden zonder extra ${soort} bij te hoeven scoren heb je ` + '`' + `${benodigdeWaarde}` + '`' + ` ${soort} nodig.\nSucces!!`;
  var embed = new MessageEmbed()
    .setColor('#FFD700')
    .setTimestamp()
    .setFooter(footerTekst, footerAfbeelding)
    .setTitle ("**" + row[0] + "**")
    .setDescription ("*Titel behouden*")
    .setThumbnail (afbeelding)
    .addField("Aantal dagen", dagen.toString())
    .addField("Benodigde " + soort, benodigdeWaarde.toString());
  const messRow = new MessageActionRow();
  if(dagen > 1){
    messRow.addComponents(
      new MessageButton()
        .setLabel((dagen - 1) + ' dagen houden')
        .setStyle('PRIMARY')
        .setCustomId('titel houden ' + (dagen - 1) + " " + row[0])
    )
  }
  messRow.addComponents(
    new MessageButton()
      .setLabel('Titel info')
      .setStyle('PRIMARY')
      .setCustomId('titel info ' + row[0])
  )
  messRow.addComponents(
    new MessageButton()
      .setLabel((dagen + 1) + ' dagen houden')
        .setStyle('PRIMARY')
        .setCustomId('titel houden ' + (dagen + 1) + " " + row[0])
  )
  message.channel.send({embeds:[embed], components:[messRow]});
  if(message.channel.guild != null){
    message.delete();
  }
}

function bereken(benodigdVoorTitel, dagen, soort){
  let uitkomst = benodigdVoorTitel;
  for (var i = 0; i < dagen; i++) {
    let tempPerc = 0;
    if (soort == 'roempunten') {
      for (var j = fameTresholds.length; j > 0; j--) {
        if (fameTresholds[j - 1] <= uitkomst) {
          tempPerc = (j - 1) / 100;
          j = 0;
        }
      }
    } else if (soort == 'berimondscore') {
      for (var j = beriTresholds.length; j > 0; j--) {
        if (beriTresholds[j - 1] <= uitkomst) {
          tempPerc = (j - 1) / 100;
          j = 0;
        }
      }
    }
    let deling = 1 - tempPerc;
    uitkomst /= deling;
    uitkomst = Math.ceil(uitkomst);
  }
  return uitkomst;
}

function setTresholds(rows)
{
  let decayInLoop = -1;
  rows.map(row=>{
    if (row[2] == 'FAME')
    {
      if (parseInt(row[4]) > decayInLoop) {
        if (parseInt(row[4]) > decayInLoop + 1) {
          fameTresholds.push(parseInt(row[3]) - 1);
        }
        fameTresholds.push(parseInt(row[3]));
        decayInLoop = parseInt(row[4]);
      }
    }
    else if (row[2] == 'ISLE')
    {
      decayInLoop = -1;
      //storm titels staan in midden -> huidige decay resetten
    }
    else if (row[2] == 'FACTION')
    {
      if (parseInt(row[4]) > decayInLoop) {
        if (parseInt(row[4]) > decayInLoop + 1) {
          beriTresholds.push(parseInt(row[3]) - 1);
        }
        beriTresholds.push(parseInt(row[3]));
        decayInLoop = parseInt(row[4]);
      }
    }
  })
}