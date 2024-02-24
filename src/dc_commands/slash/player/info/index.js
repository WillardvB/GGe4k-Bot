const {SlashCommandSubcommandBuilder} = require("@discordjs/builders");
const {Constants, Player} = require('ggejs')
const {getLocalizations} = require("../../../../tools/localization");
const empire = require("../../../../e4kClient");
const num = require("../../../../tools/number");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Locale,
    ButtonStyle,
    ChatInputCommandInteraction,
    ButtonInteraction,
    InteractionReplyOptions
} = require("discord.js");
const {logError, log} = require("../../../../tools/Logger");

const kingdoms = [0, 2, 1, 3, 4, 10];

//#region Data
const stringOptionName = "name";

module.exports.data = new SlashCommandSubcommandBuilder()
    .setName('info')
    .setDescription('Displays general data of the player.')
    .setDescriptionLocalizations({
        'nl': 'Toont algemene gegevens van het speler.'
    })
    .addStringOption(option => {
        const descLoc = getLocalizations(["dialogs", "dialog_options_error_enterValidName_desc"])
        return option
            .setName(stringOptionName)
            .setNameLocalizations({nl: "naam"})
            .setDescription(descLoc["en-US"])
            .setDescriptionLocalizations(descLoc)
            .setRequired(true)
    })
//#endregion

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.execute = async function (interaction) {
    const locale = interaction.locale;
    try {
        let playerName = interaction.options.getString(stringOptionName, true).toLowerCase().trim();
        await log(`Searching info about player: ${playerName} by ${interaction.user.displayName}`)
        const player = await empire.client.players.find(playerName);
        /**@type {any}*/
        const message = buildEmbed(player, locale);
        await interaction.followUp(message);
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
module.exports.button = async function (interaction) {
    const locale = interaction.locale;
    try {
        let playerId = parseInt(interaction.customId.toLowerCase().trim().split(' ')[2]);
        await log(`Searching info about player with id: ${playerId} by ${interaction.user.displayName}`)
        const player = await empire.client.players.getById(playerId);
        /**@type {any}*/
        const message = buildEmbed(player, locale);
        await interaction.editReply(message);
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/**
 * Creates an object containing a Discord Embed and content-string based on embed info
 * @param {Player} player
 * @param {Locale} locale
 * @returns {InteractionReplyOptions}
 */
function buildEmbed(player, locale) {
    const levelString = `${getLocalizations(["generic", "level"])[locale]}: ${player.playerLevel}${player.playerLevel === 70 ? `-${player.paragonLevel}` : ''}`;
    const allianceString = `${getLocalizations(["generic", "alliance"])[locale]}: ${player.allianceName === "" ? "" : `${player.allianceName} (${getLocalizations(["dialogs", "dialog_alliance_rank" + player.allianceRank])[locale]})`}`
    const attackProtectionString = !player.peaceEndTime ? "" : `Duif tot: <t:${Math.round(player.peaceEndTime.getTime() / 1000)}:F>\n`
    const idString = `*id: ${player.playerId}*`
    const description = `${levelString}\n${allianceString}\n${attackProtectionString}${idString}`;

    const fameString = `${getLocalizations(["dialogs", "dialog_fame_fame"])[locale]}: ${num.formatNum(player.famePoints, locale)}`;
    const honorString = `${getLocalizations(["generic", "honorPoints"])[locale]}: ${num.formatNum(player.honor, locale)}`;
    const mightString = `${getLocalizations(["dialogs", "mightPoints"])[locale]}: ${num.formatNum(player.might, locale)}`;
    const points = `${fameString}\n${honorString}\n${mightString}\n`;

    const fields = []
    if(points.trim() !== ""){
        fields.push({
            name: `**${locale === "nl" ? "Punten" : "Points"}**`, value: points
        })
    }
    if(player.castles.length > 0){
        fields.push({
            name: `**${getLocalizations(["generic", "panel_action_castleList"])[locale]}**`,
            value: listCastles(player, locale)
        })
    }

    let embed = new EmbedBuilder()
        .setTimestamp()
        .setColor("#000000")
        .setTitle(`**${player.playerName}**`)
        .setDescription(description)
        .addFields(...fields);
    if (player.villages?.private.length !== 0 || player.villages?.public.length !== 0) {
        console.log("[Speler info:39] Missing dorp en eiland command!");
        //embed.addFields({name: "Dorpen en eilanden", value: "Zie /speler dorpen voor dorp en eiland informatie"});
    }

    const components = [];
    if (player.allianceName !== "") {
        const messRow = new ActionRowBuilder();
        messRow.addComponents(/**@type {any}*/
            new ButtonBuilder()
                .setLabel(getLocalizations(["generic", "alliance"])[locale])
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`alliance info ${player.allianceId}`))
        components.push(messRow);
    }
    return /**@type {any}*/{embeds: [embed], components: components, ephemeral: true}
}

/**
 *
 * @param {Player} player
 * @param {Locale} locale
 * @return {string}
 */
function listCastles(player, locale) {
    let castleListString = "";
    for (let i in kingdoms) {
        let _castlesInKId = [];
        for (let j in player.castles) {
            if (player.castles[j].kingdomId === kingdoms[i]) {
                _castlesInKId.push(player.castles[j]);
            }
        }
        if (kingdoms[i] === 0) {
            for (let j in player.kingstowers) {
                _castlesInKId.push(player.kingstowers[j].kingstower);
            }
            for (let j in player.monuments) {
                _castlesInKId.push(player.monuments[j].monument);
            }
        }
        _castlesInKId.sort((x, y) => {
            return (!x.customName || !y.customName) ? 0 : x.customName.localeCompare(y.customName);
        });
        _castlesInKId.sort((x, y) => {
            if (x.areaType === y.areaType) return 0;
            if (x.areaType === 1 || x.areaType === 12) return -1;
            if (x.areaType === 3) {
                if (y.areaType === 1 || y.areaType === 12 || y.areaType === 4) return 1;
                return -1;
            }
            if (x.areaType === 4) {
                if (y.areaType === 1) return 1;
                return -1;
            }
            if (x.areaType === 22) {
                if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4) return 1;
                return -1;
            }
            if (x.areaType === 23) {
                if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4 || y.areaType === 22) return 1;
                return -1;
            }
            return 1;
        })

        let kingdom = "_";
        switch (kingdoms[i]) {
            case Constants.Kingdom.Classic:
                kingdom = getLocalizations(["generic", "kingdomName_Classic"])[locale];
                break;
            case Constants.Kingdom.Icecream:
                kingdom = getLocalizations(["generic", "kingdomName_Icecream"])[locale];
                break;
            case Constants.Kingdom.Desert:
                kingdom = getLocalizations(["generic", "kingdomName_Dessert"])[locale];
                break;
            case Constants.Kingdom.Volcano:
                kingdom = getLocalizations(["generic", "kingdomName_Volcano"])[locale];
                break;
            case Constants.Kingdom.Island:
                kingdom = getLocalizations(["dialogs", "dialog_island_header"])[locale];
                break;
            case Constants.Kingdom.Faction:
                kingdom = getLocalizations(["generic", "event_kingdom_berimond"])[locale];
                break;
        }

        let castles = "";
        for (let i in _castlesInKId) {
            let _castle = _castlesInKId[i];
            let _castleType = "_";
            switch (parseInt(_castle.areaType)) {
                case Constants.WorldmapArea.MainCastle:
                    _castleType = locale === "nl" ? "Hoofdkasteel" : "Main Castle";
                    break;
                case Constants.WorldmapArea.Capital:
                    _castleType = getLocalizations(["generic", "capital"])[locale];
                    break;
                case Constants.WorldmapArea.Outpost:
                    _castleType = getLocalizations(["generic", "outpost"])[locale];
                    break;
                case Constants.WorldmapArea.KingdomCastle:
                    _castleType = getLocalizations(["generic", "kingdomCastle_name"])[locale];
                    break;
                case Constants.WorldmapArea.Metropol:
                    _castleType = getLocalizations(["generic", "metropol"])[locale];
                    break;
                case Constants.WorldmapArea.Kingstower:
                    _castleType = getLocalizations(["generic", "kingstower"])[locale];
                    break;
                case Constants.WorldmapArea.Monument:
                    _castleType = getLocalizations(["generic", "monument"])[locale];
                    break;
                case Constants.WorldmapArea.FactionCamp:
                    _castleType = getLocalizations(["generic", "faction_camp"])[locale];
                    break;
                default:
                    _castleType = _castle.areaType;
            }
            castles += `\n- ${_castle.customName} (${_castle.position.X}/${_castle.position.Y}) (${_castleType})`;
        }

        if (castles.trim() !== "") {
            if (i !== 0) castleListString += "\n";
            castleListString += `**${kingdom}:**${castles}`;
        }
    }
    return castleListString;
}