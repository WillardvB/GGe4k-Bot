const {getLocalizations} = require("../../../../tools/localization");
const {titleNames} = require("./data");
const {formatNum} = require("../../../../tools/number");

/**
 *
 * @param {Title} data
 * @param {Locale} locale
 * @return {{title: string, description?: string, fields?: {name: string, value:string, inline?: boolean}[], thumbnailUrl?:string}}
 */
module.exports.getTitleInfoEmbedData = function (data, locale) {
    const stringId = data.titleID.toString();
    const requirements = getRequirements(data, locale);
    const type = data.type === "FAME" ? getLocalizations(["dialogs", "dialog_fame_title"])[locale] :
        data.type === "FACTION" ? getLocalizations(["generic", "event_kingdom_berimond"])[locale] :
            data.type === "ISLE" ? getLocalizations(["dialogs", "dialog_island_header"])[locale] : "";
    const mightPoints = formatNum(data.mightValue, locale);
    const decay = data.decay ?? 0;
    const displayType = getLocalizations(["dialogs", `dialog_titles_${data.displayType}`])[locale];
    const typeString = `- **${getLocalizations(["generic", "filters_filter_21"])[locale]}:** ${type} - ${displayType}`;
    const mpString = `- **${getLocalizations(["dialogs", "mightPoints"])[locale]}:** ${mightPoints}`;
    const decayString = `- **Afname per dag:** ${decay}%`;

    // effects...

    let embedData = `${typeString}\n${mpString}\n${requirements}\n${decayString}`;
    return {
        title: titleNames.find(n => n.raw === stringId)[locale],
        description: embedData
    };
}

/**
 *
 * @param {Title} data
 * @param {Locale} locale
 * @return {string}
 */
function getRequirements(data, locale) {
    let type = data.type;

    let val;
    if (data.topX) {
        type = type === 'ISLE' ? 'rank in het storm top1 BG' : type === 'FACTION' ? 'rank in berimondklassement' : type === 'FAME' ? 'rank in roemklassement' : type;
        val = getLocalizations(["generic", "ranking_topX"])[locale].replace('{0}', data.topX.toString());
    } else {
        type = type === 'FACTION' ?
            getLocalizations(["generic", "factionHighscore_points"])[locale] :
            type === 'FAME' ?
                getLocalizations(["dialogs", "dialog_fame_fame"])[locale] : type;
        val = data.threshold ? formatNum(data.threshold, locale) : 0;
    }
    return `- **Benodigde ${type}:** ${val}`;
}