const googleSheetsData = require('./../../data/googleSpreadSheetData.js');
const formatNumber = require('./../../tools/number.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const kostenKol = [7, 13, 33, 20, 15, 17, 25, 26, 27, 43, 47, 51, 52, 14, 1, 57, 1, 66, 70, 72, 76, 77, 78, 80, 83, 84, 85, 86, 88, 91, 92, 93, 94, 95, 96, 97, 98, 103, 109, 110, 111, 113, 115, 116, 118, 120, 121, 122, 123, 127, 128, 129, 130, 136, 137, 138, 139, 142, 144, 145, 146, 149];
const kostenSoort = ["Oppervlakte", "Benodigd level", "Benodigd legendarisch level", "Maximum aantal", "Sloopbaar", "Brandbaar", "XP", "Macht", "Decoratiepunten", "Groter zichtveld", "Grachtbonus", "Muurbonus", "Poortbonus", "Man op muur", "Productie", "Veilige opslag", "Opslag", "Bouwsnelheidsboost", "Troepen per vak te trainen", "Troepen train boost", "Plekken in het district", "Bevolking", "Marktkarren", "Spionnen", "Burchtvoogden", "Commandanten", "Stadswachten", "Brandweerbonus", "Getoonde reistijdbonus", "Verlaging bouwkosten", "% overlevingsbonus", "Hospitaalgrootte", "Hospitaalvakken", "Ratio", "Max % jachtbonus", "Extra bouwvakken", "Onderzoeksnelheidbonus", "BG voedselbonus", "Max aantal soldaten", "Moraalpunten", "Max aantal beri-soldaten", "Vrachtpunten", "Veilige aqua opslag", "Relikwieschervenbonus", "Extra uitrustingopslag", "Vaardighedenpunten", "Roembonus", "% XP bonus", "Tuigencreatieboost", "Houtproductiebonus", "Steenproductiebonus", "Voedselproductiebonus", "Consumptie reductie", "IJzerertsproductiebonus", "Houtskoolproductiebonus", "Olijfolieproductiebonus", "Glasproductiebonus", "Honingwijnratio", "Verlaging honingwijnconsumptie", "Honingwijnproductieboost", "Honingproductiebonus", "Munten opbrengst bij verkoop"];
const opslagKol = [58, 59, 60, 61, 62, 63, 64, 65, 67, 68];
const opslagSoort = ["Houtopslag", "Steenopslag", "Voedselopslag", "Houtskoolopslag", "Olijfolieopslag", "Glasopslag", "Aquamarijnopslag", "IJzerertsopslag", "Honingopslag", "Honingwijnopslag"];
const productieKol = [54, 55, 56, 131, 133, 134, 135, 140, 141];
const productieSoort = ["Houtproductie", "Steenproductie", "Voedselproductie", "Houtskoolproductie", "Olijfolieproductie", "Glasproductie", "IJzerertsproductie", "Honingproductie", "Honingwijnproductie"];

module.exports = {
	name: 'gebouw algemeen',
	description: 'Toont de algemene gegevens van het gebouw voor het gekozen level!',
  aka: '`gebouw alg`, `gebouw a`, `gebouw general`, `gebouw gen`, `gebouw g`',
  format: '`gge gebouw algemeen [level] [gebouwnaam]`',
  voorbeeld: '`gge gebouw alg 10 brouwerij`, `gge gebouw a 1 toren`',
	async execute(client, message, args) {
    const level = args.shift();
    var gebouwnaam = "";
    for(var i = 0; i < args.length; i++)
    {
      gebouwnaam += args[i].trim() + " ";
    }
    if(level == null || gebouwnaam == ""){
      return message.reply({content: "Geef meer gegevens: `gge gebouw algemeen [level] [gebouwnaam]`"});
    }
    if(!isNumeric(level)){
      return message.reply({content: "Geef een geldig getal als level!\n```gge gebouw algemeen [level] [gebouwnaam]```"});
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
      rows.map(row=>{
        if(row[1].toLowerCase() == gebouwnaam){
          gebouwGevonden = true;
          gebouwGeweest = true;
          laagsteLevel = Math.max(1, Math.min(laagsteLevel, row[12]));
          hoogsteLevel = Math.max(hoogsteLevel, row[12]);
          if(row[12] == level){
            levelGevonden = true;
            rij = [...row];
          }
        }
        else if(levelGevonden && gebouwGeweest)
        {
          gebouwGeweest = false;
          return naarOutput(message, rij, level, laagsteLevel, hoogsteLevel);
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
  let levelString = " (level " + level + ")";
  var embed = new MessageEmbed()
    .setColor('#996515')
    .setTimestamp()
    .setFooter(footerTekst, footerAfbeelding)
    .setTitle ("**" + row[1] + "**" + levelString)
    .setDescription (row[156])
    .setThumbnail (row[0])
  for(var i = 0; i < kostenKol.length; i++){
    let waarde = row[kostenKol[i]];
    let soort = kostenSoort[i];
    if(soort == "Sloopbaar" || soort == "Brandbaar"){
      waarde = waarde == "0" ? "nee" : "ja";
    }
    if(soort == "Oppervlakte"){
      waarde = waarde + "x" + row[kostenKol[i] + 1];
    }
    if(soort == "Productie"){
      waarde = "";
      for(var a = 0; a < productieKol.length; a++){
        productie = row[productieKol[a]];
        productie = formatNumber.formatNum(productie);
        if(productie != "")
        {
          waarde += productieSoort[a] + ": " + productie + "\n";
        }
      }
    }
    if(soort == "Opslag"){
      waarde = "";
      for(var a = 0; a < opslagKol.length; a++){
        opslag = row[opslagKol[a]];
        opslag = formatNumber.formatNum(opslag);
        if(opslag != "")
        {
          waarde += opslagSoort[a] + ": " + opslag + "\n";
        }
      }
    }
    if(soort == "Ratio" && waarde != "" && waarde != null && waarde != 0){
      waarde = `${waarde / 100} bs geeft 1 brood`;
    }
    if(soort == "Honingwijnratio" && waarde != "" && waarde != null && waarde != 0){
      waarde = `${waarde} honing en ${row[kostenKol[i]+1]} brood geven samen 1 honingwijn`;
    }
    if(waarde != null && waarde != "" && soort != null && soort != "")
    {
      embed.addField("**"+ soort +"**", waarde, true);
    }
  }
  const messRow = new MessageActionRow();
  if(max == min){
    messRow.addComponents(
      new MessageButton()
        .setLabel('lvl ' + level)
        .setStyle('PRIMARY')
        .setCustomId('gebouw algemeen ' + level + " " + row[1])
    )
  }
  if(level > min){
    messRow.addComponents(
      new MessageButton()
        .setLabel('lvl ' + (level*1 - 1))
        .setStyle('PRIMARY')
        .setCustomId('gebouw algemeen ' + (level*1 - 1) + " " + row[1])
    )
  }
  if(level < max){
    messRow.addComponents(
      new MessageButton()
        .setLabel('lvl ' + (level*1 + 1))
        .setStyle('PRIMARY')
        .setCustomId('gebouw algemeen ' + (level*1 + 1) + " " + row[1])
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