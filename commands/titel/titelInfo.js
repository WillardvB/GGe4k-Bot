const googleSheetsData = require('./../../data/googleSpreadSheetData.js');
const formatNumber = require('./../../tools/number.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";
let fameTresholds = [];
let beriTresholds = [];

module.exports = {
	name: 'titel info',
	description: 'Toont informatie van de titel!',
  aka: '`titel i`, `titel informatie`, `titel information`',
  format: '`gge titel info [titelnaam/-nummer]`',
  voorbeeld: '`gge titel i 107`, `gge titel i de trotse`',
	async execute(client, message, args) {
    var titelnaam = "";
    for(var i = 0; i < args.length; i++)
    {
      titelnaam += args[i].trim() + " ";
    }
    if(titelnaam == ""){
      return message.reply({content: "Geef meer gegevens: `gge titel info [titelnaam/-nummer]`"});
    }
    titelnaam = titelnaam.trim();
    const rows = await googleSheetsData.titelData(client);
    if(rows == null){
      return message.reply('De data wordt nog geladen, probeer het over enkele seconden opnieuw');
    }
    if (rows.length) {
      var titelGevonden = false;
      var soort;
      rows.map(row => {
        if (row[0].toLowerCase() == titelnaam || row[1] == titelnaam && formatNumber.isNum(titelnaam)) {
          titelGevonden = true;
          naarOutput(message, row);
        }
      });
      if (!titelGevonden) {
        return message.reply({content:
          'ik heb de gevraagde titel niet kunnen vinden. Zie `gge titel namen` voor de mogelijkheden'
        });
      }
    }
	},
  output(message, row){
    naarOutput(message,row);
  },
}

function naarOutput(message, row){
  let vereisten = welkeVereisten(row);
  let macht = formatNumber.formatNum(row[6]);
  let displayType = 'voorvoegsel';
  if (row[5] == 'suffix') {
    displayType = 'achtervoegsel';
  }
  let afname = 0;
  if (row[4]) {
    afname = row[4];
  }
  let data = `- **Macht:** ${macht}\n${vereisten}\n- **Afname per dag:** ${afname}%\n- **Weergave-info:** ${displayType}`;
  let embed = new MessageEmbed()
    .setColor('#FFD700')
    .setTimestamp()
    .setFooter(footerTekst, footerAfbeelding)
    .setTitle ("**" + row[0] + "**")
    .setDescription ("*Informatie*")
    .setThumbnail (afbeelding)
    .addField("**Data**", data);
  if (row[28] != 'komt nog') {
    embed.addField('**Beloning**', '*' + row[28] + '*');
  }
  message.channel.send({embeds: [embed]});
  if(message.channel.guild != null){
    message.delete();
  }
}

function welkeVereisten(row){
  let soort= row[2];
  let benodigdheden = "";
  if (soort == 'FAME') {
    soort = 'roempunten';
  } else if (soort == 'FACTION') {
    soort = 'berimondpunten';
  };
  if (row[10] > 0) {
    if (soort == 'ISLE') {
      soort = 'rank in het storm top1 BG';
    } else {
      if (soort == 'berimondpunten') {
        soort = 'rank in berimondklassement';
      }
      if (soort == 'roempunten') {
        soort = 'rank in roemklassement';
      }
    }
    benodigdheden = 'top' + row[10];
  } else if (row[3]) {
    benodigdheden = row[3];
  }
  return `- **Benodigde ${soort}:** ${benodigdheden}`;
}