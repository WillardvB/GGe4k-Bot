const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder} = require("discord.js");
const empire = require("../../../empireClient");
const translationData = require('e4k-data').languages.nl;

const _name = 'bondgenootschap leden';
module.exports = {
    name: _name,
    /**
     *
     * @param {CommandInteraction | ButtonInteraction | SelectMenuInteraction} interaction
     */
    async execute(interaction) {
        try {
            let allianceName = '';
            /** @type {number | null} */
            let rank = null;
            if (interaction.options) {
                allianceName = interaction.options.getString('naam').toLowerCase().trim();
                rank = interaction.options.getInteger('rang');
            } else if (interaction.customId) {
                allianceName = interaction.customId.toLowerCase().trim().split(' ').slice(2).join(" ");
                if (allianceName.includes("----------------------------")) {
                    let __ = allianceName.split('----------------------------');
                    allianceName = __[0];
                    if (__.length === 1) rank = null
                    else {
                        rank = parseInt(__[1]);
                        if (rank === -1) rank = null;
                    }
                }
                if (interaction.values?.length === 1) {
                    if (interaction.values[0] === "Alle") rank = null;
                    else rank = parseInt(interaction.values[0]);
                }
            }
            if (rank == null) rank = -1; else rank -= 1;
            const alliance = await empire.client.alliances.find(allianceName);
            let embed = new EmbedBuilder()
                .setDescription(rank === -1 ? "Alle leden" : "Leden met rang: " + translationData.dialogs["dialog_alliance_rank" + rank])
                .setTimestamp()
                .setColor("#000000")
                .setTitle(`**${alliance.allianceName}**`)
            let _allianceRank = translationData.dialogs["dialog_alliance_rank" + 0];
            let memberList = "";
            let isSecondField = false;
            for (let i in alliance.memberList) {
                let member = alliance.memberList[i];
                let _rank = member.allianceRank;
                if (rank === -1 || rank === _rank) {
                    if (memberList !== "" && _allianceRank !== translationData.dialogs["dialog_alliance_rank" + _rank]) {
                        let __allianceRank = _allianceRank
                        if (isSecondField) __allianceRank += " 2";
                        await embed.addFields({
                            name: __allianceRank, value: memberList, inline: true
                        });
                        memberList = "";
                        isSecondField = false;
                    }
                    _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                    if ((memberList + `__${fixNameString(member.playerName)}__, level: ${member.playerLevel}\n`).length > 1020) {
                        await embed.addFields({
                            name: _allianceRank, value: memberList, inline: true
                        });
                        memberList = "";
                        _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                        isSecondField = true;
                    }
                    memberList += `__${fixNameString(member.playerName)}__, level: ${member.playerLevel}\n`;
                }
                if (memberList !== "" && (_allianceRank !== translationData.dialogs["dialog_alliance_rank" + _rank] || i === alliance.memberList.length - 1)) {
                    let __allianceRank = _allianceRank
                    if (isSecondField) __allianceRank += " 2";
                    await embed.addFields({
                        name: __allianceRank, value: memberList, inline: true
                    });
                    memberList = "";
                    _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                    isSecondField = false;
                }
            }
            if (memberList.trim() !== "") {
                let __allianceRank = _allianceRank
                if (isSecondField) __allianceRank += " 2";
                if (memberList !== "")
                    await embed.addFields({
                        name: __allianceRank, value: memberList, inline: true
                    });
            }
            const messRow = new ActionRowBuilder();
            let _options = [];
            if (rank !== -1) _options.push({
                label: 'Alle',
                description: 'Alle leden',
                value: 'Alle'
            });
            for (let i = 0; i <= 9; i++) {
                if (rank === i) continue;
                let ___description = translationData.dialogs["dialog_alliance_rankinfo" + i].split('.')[0] + ".";
                if (___description.length > 100) ___description = ___description.substring(0, 97).trim() + "...";
                _options.push({
                    label: translationData.dialogs["dialog_alliance_rank" + i],
                    description: ___description,
                    value: (i + 1).toString()
                })
            }
            messRow.addComponents(
                new StringSelectMenuBuilder()
                    .setOptions(_options)
                    .setMaxValues(1)
                    .setPlaceholder('Filter leden')
                    .setCustomId(`${_name} ${allianceName}`)
            )
            const messRow2 = new ActionRowBuilder();
            messRow2.addComponents(
                new ButtonBuilder()
                    .setLabel(translationData.dialogs.dialog_alliance_info)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`bondgenootschap info ${allianceName}`),
                new ButtonBuilder()
                    .setLabel(translationData.generic.worldMap)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`worldmap alliance ${alliance.allianceId} 0 1 1 0 0`)
            )
            if (interaction.options) {
                if (interaction.isStringSelectMenu())
                    await interaction.update({embeds: [embed], components: [messRow, messRow2]});
                else
                    await interaction.followUp({embeds: [embed], components: [messRow, messRow2]});
            } else if (interaction.customId) {
                await interaction.editReply({embeds: [embed], components: [messRow, messRow2]});
            }
        } catch (e) {
            await interaction.followUp({content: e.toString()});
        }
    }
}

/**
 *
 * @param {string} _string
 */
function fixNameString(_string) {
    return _string.replace('_', '\_').replace('*', '\*').replace('~', '\~');
}