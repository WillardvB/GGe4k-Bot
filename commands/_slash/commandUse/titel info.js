const googleSheetsData = require('./../../../data/googleSpreadSheetData.js');
const formatNumber = require('./../../../tools/number.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";
let fameTresholds = [];
let beriTresholds = [];

module.exports = {
	name: 'titel info',
	async execute(client, interaction) {
    let titel;
    if(interaction.options){
      titel = interaction.options.getString('titel');
    }
    else if(interaction.customId){
      var string = interaction.customId.split(' ');
      titel = string[2];
      for(i = 3; i < string.length; i++){
        titel += " " + string[i];
      }
    }
    titel = titel.trim().toLowerCase();
    const data = await googleSheetsData.titelData(client);
    const rows = [...data];
    if (rows.length) {
      var titelGevonden = false;
      var soort;
      rows.map(row => {
        if (row[0].toLowerCase() == titel || row[1] == titel && formatNumber.isNum(titel)) {
          titelGevonden = true;
          naarOutput(interaction, row);
        }
      });
      if (!titelGevonden) {
        return interaction.followUp({content:
          'ik heb de gevraagde titel niet kunnen vinden. Zie `gge titel namen` voor de mogelijkheden'
        });
      }
    }
	},
  output(interaction, row){
    naarOutput(interaction, row);
  }
};

function naarOutput(interaction, row){
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
  if(interaction.options){
    interaction.followUp({embeds: [embed], components: [], ephemeral: true});
  }else{
    interaction.editReply({embeds: [embed], components: [], ephemeral: true});
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