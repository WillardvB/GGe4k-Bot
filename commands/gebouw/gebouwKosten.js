const googleSheetsData = require('./../../data/googleSpreadSheetData.js');
const formatNumber = require('./../../tools/number.js');
const formatDuration = require('./../../tools/time.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const kostenKol = [21, 22, 82, 81, 48, 49, 35, 36, 112, 42, 23];
const kostenSoort = ["Hout", "Steen", "Houtskool", "Olijfolie", "Glas", "IJzererts", "Bouwmunt", "Upgrademunt", "Aquamarijn", "Robijnen", "Tijd"];

module.exports = {
	name: 'gebouw kosten',
	description: 'Toont de kosten van het gebouw voor het gekozen level!',
  aka: '`gebouw kost`, `gebouw k`, `gebouw costs`, `gebouw cost`, `gebouw c`',
  format: '`gge gebouw kosten [level] [gebouwnaam]`',
  voorbeeld: '`gge gebouw k 520 zaal der legenden`, `gge gebouw c 7 de slottoren`',
	async execute(client, message, args) {
    const level = args.shift();
    var gebouwnaam = "";
    for(var i = 0; i < args.length; i++)
    {
      gebouwnaam += args[i].trim() + " ";
    }
    if(level == null || gebouwnaam == ""){
      return message.reply({content: "Geef meer gegevens: `gge gebouw kosten [level] [gebouwnaam]`"});
    }
    if(!isNumeric(level)){
      return message.reply({content: "Geef een geldig getal als level!\n```gge gebouw kosten [level] [gebouwnaam]```"});
    }
    gebouwnaam = gebouwnaam.trim();
    const rows = await googleSheetsData.gebouwData(client);
    if(rows == null){
      return message.reply('De data wordt nog geladen, probeer het over enkele seconden opnieuw');
    }
    if (rows.length) {
      let gebouwGevonden = false;
      let levelGevonden = false;
      let hoogsteLevel = 1;
      let laagsteLevel = 550;
      let rijTotalen = [];
      let gebouwGeweest = false;
      let rij = [];
      rows.map(row=>{
        if(row[1].toLowerCase() == gebouwnaam){
          gebouwGevonden = true;
          gebouwGeweest = true;
          laagsteLevel = Math.max(1, Math.min(laagsteLevel, row[12]));
          hoogsteLevel = Math.max(hoogsteLevel, row[12]);
          if(row[12] == level){
            levelGevonden = true;
            rij = [...row];
            return;
          }
          else if(level == "-1"){
            levelGevonden = true;
            if(rijTotalen.length == 0)
            {
              rijTotalen = [...row];
            }
            else
            {
              for(var a = 0; a < row.length; a++){
                if(kostenKol.includes(a)){
                  if(row[a] != "" && row[a] != null)
                  rijTotalen[a] = rijTotalen[a] * 1 + row[a] * 1;
                }
                else
                {
                  rijTotalen[a] = row[a];
                }
              }
            }
          }
        }
        else
        {
          if(level == "-1" && gebouwGeweest){
            gebouwGeweest = false;
            naarOutput(message, rijTotalen, level, laagsteLevel, hoogsteLevel);
            rijTotalen = [];
            return;
          }
          else if(levelGevonden && gebouwGeweest)
          { 
            gebouwGeweest = false;
            naarOutput(message, rij, level, laagsteLevel, hoogsteLevel);
            rijTotalen = [];
            return;
          }
        }
      })
      if(levelGevonden){
        return;
      }
      if(gebouwGevonden){
        message.reply({content: "geef een level tussen `"+laagsteLevel+"` en `"+hoogsteLevel+"`"})
      }else{
        message.reply({content: "geef een geldige nederlandse gebouwnaam"})
      }
    }
	},
};

function naarOutput(message, row, level, min, max){
  kostenOverzicht = "";
  for(var i = 0; i < kostenKol.length; i++){
    let waarde = row[kostenKol[i]] * 1;
    let soort = kostenSoort[i];
    if(soort == "Tijd"){
      waarde = formatDuration.secToDuration(waarde);
    }else{
      waarde = formatNumber.formatNum(waarde);
    }
    if(waarde != "" && waarde != null){
      kostenOverzicht += soort + ": `\t\t" + waarde + '`\n';
    }
  }
  let levelString = "";
  if(level == "-1"){
    levelString = " (totaal van alle levels)";
  }
  else {
    levelString = " (level " + level + ")";
  }
  var embed = new MessageEmbed()
    .setColor('#996515')
    .setTimestamp()
    .setFooter(footerTekst, footerAfbeelding)
    .setTitle ("**" + row[1] + "**" + levelString)
    .setDescription (row[156])
    .setThumbnail (row[0])
    .addField("**Kosten**", kostenOverzicht);
  const messRow = new MessageActionRow();
  if(level >= min && level <= max){
    if(level > min && level <= max){
      messRow.addComponents(
        new MessageButton()
          .setLabel('lvl ' + (level*1 - 1))
          .setStyle('PRIMARY')
          .setCustomId('gebouw kosten ' + (level*1 - 1) + " " + row[1])
      )
    }
    if(level < max && level >= min){
      messRow.addComponents(
        new MessageButton()
          .setLabel('lvl ' + (level*1 + 1))
          .setStyle('PRIMARY')
          .setCustomId('gebouw kosten ' + (level*1 + 1) + " " + row[1])
      )
    }
    messRow.addComponents(
      new MessageButton()
        .setLabel('Totaal alle levels')
        .setStyle('PRIMARY')
        .setCustomId('gebouw kosten -1 ' + row[1])
    )
  }
  else
  {
    if(min != max){
    messRow.addComponents(
      new MessageButton()
        .setLabel('lvl ' + min)
        .setStyle('PRIMARY')
        .setCustomId('gebouw kosten ' + min + ' ' + row[1])
    )}
    messRow.addComponents(
      new MessageButton()
        .setLabel('lvl ' + max)
        .setStyle('PRIMARY')
        .setCustomId('gebouw kosten ' + max + ' ' + row[1])
    )
  }
  message.channel.send({embeds: [embed], components: [messRow]});
  if(message.channel.guild != null){
    message.delete();
  }
}

function isNumeric(num){
  num = "" + num; //coerce num to be a string
  return !isNaN(num) && !isNaN(parseFloat(num));
}