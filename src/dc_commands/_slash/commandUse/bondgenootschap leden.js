const { CommandInteraction, EmbedBuilder } = require("discord.js");
const empire = require("../../../empireClient");
const translationData = require('./../../../ingame_translations/nl.json');

module.exports = {
    name: 'bondgenootschap leden',
    /**
     * 
     * @param {any} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            let allianceName = interaction.options.getString('naam').toLowerCase().trim();
            let rank = interaction.options.getInteger('rang');
            if (rank == null) rank = -1; else rank -= 1;
            const alliance = await empire.client.alliances.find(allianceName);
            let embed = new EmbedBuilder()
                .setDescription("leden")
                .setTimestamp()
                .setColor("#000000")
                .setTitle(`**${alliance.allianceName}**`)
            let _allianceRank = translationData.dialogs["dialog_alliance_rank" + 0];
            let memberList = "";
            let isSecondField = false;
            for (i in alliance.memberList) {
                let member = alliance.memberList[i];
                let _rank = member.allianceRank;
                if (rank == -1 || rank == _rank) {
                    if (memberList !== "" && _allianceRank !== translationData.dialogs["dialog_alliance_rank" + _rank]) {
                        let __allianceRank = _allianceRank
                        if (isSecondField) __allianceRank += " 2";
                        embed.addFields({
                            name: __allianceRank, value: memberList, inline: true
                        });
                        memberList = "";
                        isSecondField = false;
                    }
                    _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                    if ((memberList + `__${fixNameString(member.playerName)}__, level: ${member.playerLevel}\n`).length > 1020) {
                        embed.addFields({
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
                    embed.addFields({
                        name: __allianceRank, value: memberList, inline: true
                    });
                    memberList = "";
                    _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                    isSecondField = false;
                }
            }
            await interaction.followUp({ embeds: [embed] });
        }
        catch (e) {
            await interaction.followUp({ content: e.toString() });
            return;
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