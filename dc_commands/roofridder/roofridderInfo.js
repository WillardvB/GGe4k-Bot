const googleSheetsData = require('./../../data/googleSpreadSheetData.js');
const formatNumber = require('./../../tools/number.js');
const formatDuration = require('./../../tools/time.js');
const klingThumb = "https://media.discordapp.net/attachments/884049583313928202/886594500972126298/icon_events_seaqueen_enter.png";
const klingImg = "https://media.discordapp.net/attachments/884049583313928202/886598611713015828/teaser_seaqueen_splash.png";
const klingKleur = "#00008B";
const groenThumb = "https://media.discordapp.net/attachments/884049583313928202/886594501274132510/icon_kingdom_empire_enter.png";
const groenImg = "https://media.discordapp.net/attachments/884049583313928202/886597206537289728/teaser_questbook_kingdom_green.png";
const groenKleur = "#76BA1B";
const ijsThumb = "https://media.discordapp.net/attachments/884049583313928202/886590766510645258/icon_kingdom_snow_enter.png";
const ijsImg = "https://media.discordapp.net/attachments/884049583313928202/886590766791667742/teaser_questbook_kingdom_winter.png";
const ijsKleur = "#35BAF6";
const zandThumb = "https://media.discordapp.net/attachments/882701028078801002/886553341230989312/icon_kingdom_desert_enter.png";
const zandImg = "https://media.discordapp.net/attachments/882701028078801002/886553341478436894/teaser_questbook_kingdom_desert.png";
const zandKleur = "#EFDD6F";
const vuurThumb = "https://media.discordapp.net/attachments/884049583313928202/886594501550952488/icon_kingdom_volcano_enter.png";
const vuurImg = "https://media.discordapp.net/attachments/884049583313928202/886597206277238784/teaser_questbook_kingdom_fire.png";
const vuurKleur = "#FD3A2D";
const stormThumb = "https://media.discordapp.net/attachments/884049583313928202/886596077170610236/icon_island_xl_ds.png";
const stormImg = "https://media.discordapp.net/attachments/884049583313928202/886596077405474857/teaser_island_introduction.png";
const stormKleur = "#ADD8E6";
const beriThumb = "https://media.discordapp.net/attachments/884049583313928202/886594500762423329/icon_events_berimond_enter.png";
const beriImg = "https://media.discordapp.net/attachments/884049583313928202/886598084958752808/teaser_berimond_splash.png";
const beriKleur = "#FF00FF";
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

module.exports = {
	name: 'roofridder info',
	description: 'Geeft alle info over de roofridder!',
  aka: '`roofridder i`',
  format: '`gge roofridder info [wereld] [level] [wins tot lvl up]`',
  voorbeeld: '`gge roofridder i g 80 5`, `gge roofridder info vuur 50 1`',
	async execute(client, message, args) {
    let wereld = args.shift();
    let level = args.shift();
    let totVolgendLevel = args.shift();
    let rrGevonden = false;
    if(totVolgendLevel == null || totVolgendLevel == ""){
      return message.reply({content:"Geef meer gegevens:\n`gge roofridder info [wereld] [level] [wins tot lvl up]`"});
    }
    if(!isNumeric(totVolgendLevel) || !(isNumeric(level) || level == "draak" || level == "d" || level == "woestijnfort" || level == "wf" || level == "barbarenfort" || level == "bf"))
    {
      return message.reply({content:"[level] enof [wins tot lvl up] zijn geen geldige waarden"});
    }
    const kID = krijgKID(wereld);
    let minLvlRRvanRijk = krijgMinimumVanRijk(kID);
    let maxLvlRRvanRijk = krijgMaximumVanRijk(kID);
    if(!(level == "draak" || level == "d" || level == "woestijnfort" || level == "wf" || level == "barbarenfort" || level == "bf" || kID < 0 || kID > 3))
    {
      level = Math.max(Math.min(level, maxLvlRRvanRijk), minLvlRRvanRijk);
      if(level == maxLvlRRvanRijk)
      {
        totVolgendLevel = 0;
      }
      else{
        const vict = krijgVictories(kID, level, totVolgendLevel);
        level = victToLvlArray(vict, kID)[0];
        totVolgendLevel = victToLvlArray(vict, kID)[1];
      }
    }
    if(level <= minLvlRRvanRijk){
      level = minLvlRRvanRijk;
      totVolgendLevel = 1;
    }
    const victories = krijgVictories(kID, level, totVolgendLevel);
    if(victories == -999){
      return message.reply({content: "je genoemde wereld is geen geldige waarde!\nKies uit: `groen, g, ijs, y, zand, z, vuur, v, storm, s, beri, b`"});
    }
    const rows = await googleSheetsData.rrData(client);
    if(rows == null){
      return message.reply('De data wordt nog geladen, probeer het over enkele seconden opnieuw');
    }
    if (rows.length) {
      rows.map(row=>{
        if(row[0] == victories){
          if(row[1] == kID){
            rrGevonden = true;
            naarOutput(client, message, row, kID, level, totVolgendLevel, victories);
            return;
          }
        }
      })
      if(rrGevonden){
        return;
      }else{
        message.reply({content:"ik heb het rr level niet gevonden, ook al zou het wel te vinden moeten zijn met deze gegevens. Probeer het opnieuw of neem contact op met de bot-mods!"})
      }
    }
	},
};

function naarOutput(client, message, row, kID, level, totVolgendLevel, victories){
  let afbeelding = "";
  let thumbnail = "";
  let kleur = "";
  switch(kID+""){
    case "-1": afbeelding = klingImg; thumbnail = klingThumb; kleur = klingKleur; break;
    case "0": afbeelding = groenImg; thumbnail = groenThumb; kleur = groenKleur; break;
    case "1": afbeelding = zandImg; thumbnail = zandThumb; kleur = zandKleur; break;
    case "2": afbeelding = ijsImg; thumbnail = ijsThumb; kleur = ijsKleur; break;
    case "3": afbeelding = vuurImg; thumbnail = vuurThumb; kleur = vuurKleur; break;
    case "4": afbeelding = stormImg; thumbnail = stormThumb; kleur = stormKleur; break;
    case "10": afbeelding = beriImg; thumbnail = beriThumb; kleur = beriKleur; break;
    default: break;
  }
  let soldatenLinks = krijgSolsEnTools(row, 85, 11);
  let soldatenMidden = krijgSolsEnTools(row, 74, 11);
  let soldatenRechts = krijgSolsEnTools(row, 96, 11);
  let toolsLinks = krijgSolsEnTools(row, 107, 6);
  let toolsMidden = krijgSolsEnTools(row, 113, 6);
  let toolsRechts = krijgSolsEnTools(row, 119, 6);
  let soldatenBP = krijgSolsEnTools(row, 125, 11);
  let levelString = "Roofridder level "
  let totVolgendLevelString = " (nog "+totVolgendLevel+"x voor volgend level)"
  if(row[0]=="-1"){
    levelString = "";
    totVolgendLevelString = "";
  }
  krijgAttTactiek(client, kID, victories).then(attTactiek =>
  {
    let embed = new MessageEmbed()
      .setColor(kleur)
      .setTimestamp()
      .setFooter(footerTekst, footerAfbeelding)
      .setTitle ("**" + levelString + level + totVolgendLevelString + "**")
      .setDescription ("*roofridder data*")
      .setThumbnail(thumbnail)
      .setImage(afbeelding)
      .addField("**Links**", soldatenLinks + "\n" + toolsLinks, true)
      .addField("**Midden**", soldatenMidden + "\n" + toolsMidden, true)
      .addField("**Rechts**", soldatenRechts + "\n" + toolsRechts, true)
      .addField("**Binnenplaats**", soldatenBP, true)
    if(kID >= 0 && kID <= 3){
      embed.addField("**Aanbevolen aanvalstactiek**", attTactiek, true)
        .addField("**Te halen buit**", krijgBuit(level), true);
    }
    const messRow = new MessageActionRow();
    if(level > krijgMinimumVanRijk(kID)){
      var tempLvlArray = victToLvlArray(victories - 1, kID);
      messRow.addComponents(
        new MessageButton()
          .setLabel('lvl ' + tempLvlArray[0] + '.' + tempLvlArray[1])
          .setStyle('PRIMARY')
          .setCustomId('roofridder info ' + kID + " " + tempLvlArray[0] + ' ' + tempLvlArray[1])
      )
    }
    if(level < krijgMaximumVanRijk(kID)){
      var tempLvlArray = victToLvlArray(victories + 1, kID);
      messRow.addComponents(
        new MessageButton()
          .setLabel('lvl ' + tempLvlArray[0] + '.' + tempLvlArray[1])
          .setStyle('PRIMARY')
          .setCustomId('roofridder info ' + kID + " " + tempLvlArray[0] + ' ' + tempLvlArray[1])
      )
    }
    if(victories == "-1"){
      message.channel.send({embeds: [embed]});
    }
    else
    {
      message.channel.send({embeds: [embed], components: [messRow]});
    }
    if(message.channel.guild != null){
      message.delete();
    }
  })
}

function krijgAttTactiek(client, kID, victories){
  return new Promise(async function (resolve, reject) {
    const tactieken = await googleSheetsData.rrAttData(client, kID);
    if(tactieken.length){
      if(victories == "-1"){
        resolve("~");
      }
      else
      {
        const rij = tactieken[victories];
        const midden = rij[5] != null ? rij[5] : "";
        const rechts = rij[8] != null ? rij[8] : "";
        const tactiek = `Links: ${rij[2]}\nMidden: ${midden}\nRechts: ${rechts}`;
        resolve(tactiek);
      }
    }
  })
}

function krijgBuit(lvl)
{
  if(!isNumeric(lvl)){
    return "~";
  }
  const bs = Math.floor(Math.pow(lvl, 2.2) * 1.2 + 90);
  let munt = 0;
  if(lvl >= 61)
  {
    munt = Math.floor(Math.pow(lvl, 1.1) * 210);
  }
  else {
    munt = Math.floor(Math.pow(lvl, 2.1) * 3.5 + 25);
  }
  const robsMin = lvl >= 3 ? Math.floor(Math.max(0, (0 * 11 - 5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
  const robsMax = lvl >= 3 ? Math.floor(Math.max(0, (1 * 11 - 5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
  let robs;
  if(robsMin == robsMax){
    robs = robsMax;
  }else{
    robs = robsMin + '-' + robsMax;
  }
  const output = `BS: ${formatNumber.formatNum(bs)}\nMunten: ${formatNumber.formatNum(munt)}\nRobijnen: ${robs}`;
  return output;
}

function krijgSolsEnTools(row, startWaarde, waardes){
  let tekst = "";
  for(let s = 0; s < waardes; s++){
    let waarde = row[startWaarde + s]
    if(waarde != null && waarde != ""){
      tekst += waarde + "\n";
    }
  }
  if((tekst == "" || tekst == null) && waardes != 6){
    tekst = "~";
  }
  return tekst;
}

function krijgKID(wereld)
{
  let kingdomID = 0;
  switch(wereld.trim())
  {
    case "groen": kingdomID = 0; break;
    case "g": kingdomID = 0; break;
    case "ijs": kingdomID = 2; break;
    case "y": kingdomID = 2; break;
    case "zand": kingdomID = 1; break;
    case "z": kingdomID = 1; break;
    case "vuur": kingdomID = 3; break;
    case "v": kingdomID = 3; break;
    case "beri": kingdomID = 10; break;
    case "b": kingdomID = 10; break;
    case "storm": kingdomID = 4; break;
    case "s": kingdomID = 4; break;
    case "klingkust": kingdomID = -1; break;
    case "k": kingdomID = -1; break;
    default: kingdomID = -999; break;
  }
  return kingdomID;
}

function krijgVictories(kID, level, totVolgendLevel)
{
  let minLvlvanRijk = krijgMinimumVanRijk(kID);
  let maxLvlvanRijk = krijgMaximumVanRijk(kID);
  if(kID == -999)
  {
    return -999;
  }
  if(level == "draak" || level == "d" || level == "woestijnfort" || level == "wf" || level == "barbarenfort" || level == "bf")
  {
    return "-1";
  }
  if(kID == 4)
  {
    return level - totVolgendLevel + 2;
  }
  else if(level == minLvlvanRijk)
  {
    return 0;
  }
  else
  {
    return Math.max(Math.min(
      Math.floor(Math.pow((maxLvlvanRijk - minLvlvanRijk) / 1.9, 1 / 0.555) + 1),
      Math.floor(Math.pow((level - minLvlvanRijk + 1) / 1.9, 1 / 0.555) + 1 - totVolgendLevel)
    ), 0);
  }
}

function isNumeric(num){
  num = "" + num; //coerce num to be a string
  return !isNaN(num) && !isNaN(parseFloat(num));
}

function victToLvlArray(victories, kID){
  const minimumLevel = krijgMinimumVanRijk(kID);
  const level = Math.floor(1.9 * Math.pow(Math.abs(victories), 0.555)) + minimumLevel;
  const victLvl = krijgVictories(kID, level, 0);
  const totLvlUp = victLvl - victories;
  return [level, totLvlUp];
}

function krijgMinimumVanRijk(kID){
  let minLvlRRvanRijk = 0;
  switch(kID + "")
  {
    case "0": minLvlRRvanRijk = 1; break;
    case "2": minLvlRRvanRijk = 20; break;
    case "1": minLvlRRvanRijk = 35; break;
    case "3": minLvlRRvanRijk = 45; break;
    default: break;
  }
  return minLvlRRvanRijk;
}

function krijgMaximumVanRijk(kID){
  let maxLvlRRvanRijk = 100;
  switch(kID + "")
  {
    case "0": maxLvlRRvanRijk = 81; break;
    case "2": maxLvlRRvanRijk = 51; break;
    case "1": maxLvlRRvanRijk = 61; break;
    case "3": maxLvlRRvanRijk = 71; break;
    default: break;
  }
  return maxLvlRRvanRijk;
}