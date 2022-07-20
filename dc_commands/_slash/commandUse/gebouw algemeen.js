const stringSimilarity = require("string-similarity");
const googleSheetsData = require('./../../../data/googleSpreadSheetData.js');
const buildingData = require('./../../../ingame_data/buildings.json');
const translationData = require('./../../../ingame_translations/nl.json');
const formatNumber = require('./../../../tools/number.js');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js');
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
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        let level;
        let gebouwnaam;
        if (interaction.options) {
            level = interaction.options.getInteger('level');
            gebouwnaam = interaction.options.getString('naam');
        }
        else if (interaction.customId) {
            var string = interaction.customId.split(' ');
            level = string[2];
            gebouwnaam = string[3];
            for (i = 4; i < string.length; i++) {
                gebouwnaam += " " + string[i];
            }
        }
        gebouwnaam = gebouwnaam.trim().toLowerCase();
        let _mogelijkeGebouwnamen = ["Zaal der legenden"];
        let _output = "null";
        let foundBuildingName = "<Not found>";
        for (let _intern_buildingName in translationData.buildings_and_decorations) {
            if (translationData.buildings_and_decorations[_intern_buildingName].toLowerCase().trim() === gebouwnaam) {
                foundBuildingName = _intern_buildingName;
                break;
            }
            else if (_intern_buildingName.endsWith('_name')){
                let _mogelijkGebouwNaam = translationData.buildings_and_decorations[_intern_buildingName];
                if(!_mogelijkeGebouwnamen.includes(_mogelijkGebouwNaam))
                    _mogelijkeGebouwnamen.push(_mogelijkGebouwNaam);
            }
        }
        if (foundBuildingName === "<Not found>") {
            if (gebouwnaam === "zaal der legenden") foundBuildingName = translationData.dialogs.dialog_legendtemple_name;
        }
        if (foundBuildingName === "<Not found>") {
            const bestMatch = stringSimilarity.findBestMatch(gebouwnaam, _mogelijkeGebouwnamen).bestMatch;
            interaction.followUp({
                content: "Ik kan het gebouw met de opgegeven naam niet vinden!\nBedoelde je __" + bestMatch.target + "__",
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton().setCustomId(`gebouw algemeen ${level} ${bestMatch.target}`)
                            .setLabel("Ja!").setStyle('SUCCESS')
                    )
                ]
            });
            return;
        }
        foundBuildingName = foundBuildingName.split('_name')[0];
        if (foundBuildingName.startsWith('dialog_')) foundBuildingName = foundBuildingName.substring(7);
        if (foundBuildingName.startsWith('deco_')) foundBuildingName = foundBuildingName.substring(5);
        for (let _building in buildingData) {
            if (buildingData[_building].name.toLowerCase() === foundBuildingName) {
                _output = JSON.stringify(buildingData[_building]);
            }
        }
        for (let _building in buildingData) {
            if (buildingData[_building].type.toLowerCase() === foundBuildingName) {
                _output = JSON.stringify(buildingData[_building]);
            }
        }
        if (interaction.options) {
            interaction.followUp({ content: _output });
        } else {
            interaction.editReply({ content: _output });
        }
        return;
        const rows = await googleSheetsData.gebouwData();
        if (rows.length) {
            let gebouwGevonden = false;
            let levelGevonden = false;
            let hoogsteLevel = 1;
            let laagsteLevel = 550;
            let rij;
            rows.map(row => {
                if (row[1].toLowerCase() == gebouwnaam) {
                    gebouwGevonden = true;
                    gebouwGeweest = true;
                    laagsteLevel = Math.max(1, Math.min(laagsteLevel, row[12]));
                    hoogsteLevel = Math.max(hoogsteLevel, row[12]);
                    if (row[12] == level) {
                        levelGevonden = true;
                        rij = [...row];
                    }
                }
                else if (levelGevonden && gebouwGeweest) {
                    gebouwGeweest = false;
                    return naarOutput(interaction, rij, level, laagsteLevel, hoogsteLevel);
                }
            })
            if (levelGevonden) {
                return;
            }
            if (gebouwGevonden) {
                interaction.followUp({ content: "geef een level tussen `" + laagsteLevel + "` en `" + hoogsteLevel + "`", ephemeral: true })
            } else {
                interaction.followUp({ content: "geef een geldige nederlandse gebouwnaam", ephemeral: true });
            }
        }
    },
};

function naarOutput(interaction, row, level, min, max) {
    let levelString = " (level " + level + ")";
    var embed = new MessageEmbed()
        .setColor('#996515')
        .setTimestamp()
        .setFooter(footerTekst, footerAfbeelding)
        .setTitle("**" + row[1] + "**" + levelString)
        .setDescription(row[156])
        .setThumbnail(row[0])
    for (var i = 0; i < kostenKol.length; i++) {
        let waarde = row[kostenKol[i]];
        let soort = kostenSoort[i];
        if (soort == "Sloopbaar" || soort == "Brandbaar") {
            waarde = waarde == "0" ? "nee" : "ja";
        }
        if (soort == "Oppervlakte") {
            waarde = waarde + "x" + row[kostenKol[i] + 1];
        }
        if (soort == "Productie") {
            waarde = "";
            for (var a = 0; a < productieKol.length; a++) {
                productie = row[productieKol[a]];
                productie = formatNumber.formatNum(productie);
                if (productie != "") {
                    waarde += productieSoort[a] + ": " + productie + "\n";
                }
            }
        }
        if (soort == "Opslag") {
            waarde = "";
            for (var a = 0; a < opslagKol.length; a++) {
                opslag = row[opslagKol[a]];
                opslag = formatNumber.formatNum(opslag);
                if (opslag != "") {
                    waarde += opslagSoort[a] + ": " + opslag + "\n";
                }
            }
        }
        if (soort == "Ratio" && waarde != "" && waarde != null && waarde != 0) {
            waarde = `${waarde / 100} bs geeft 1 brood`;
        }
        if (soort == "Honingwijnratio" && waarde != "" && waarde != null && waarde != 0) {
            waarde = `${waarde} honing en ${row[kostenKol[i] + 1]} brood geven samen 1 honingwijn`;
        }
        if (waarde != null && waarde != "" && soort != null && soort != "") {
            embed.addField("**" + soort + "**", waarde, true);
        }
    }
    const messRow = new MessageActionRow();
    if (max == min) {
        messRow.addComponents(
            new MessageButton()
                .setLabel('lvl ' + level)
                .setStyle('PRIMARY')
                .setCustomId('gebouw algemeen ' + level + " " + row[1])
        )
    }
    if (level > min) {
        messRow.addComponents(
            new MessageButton()
                .setLabel('lvl ' + (level * 1 - 1))
                .setStyle('PRIMARY')
                .setCustomId('gebouw algemeen ' + (level * 1 - 1) + " " + row[1])
        )
    }
    if (level < max) {
        messRow.addComponents(
            new MessageButton()
                .setLabel('lvl ' + (level * 1 + 1))
                .setStyle('PRIMARY')
                .setCustomId('gebouw algemeen ' + (level * 1 + 1) + " " + row[1])
        )
    }
    if (interaction.options) {
        interaction.followUp({ embeds: [embed], components: [messRow], ephemeral: true });
    } else {
        interaction.editReply({ embeds: [embed], components: [messRow], ephemeral: true });
    }
}