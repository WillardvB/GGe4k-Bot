const {Constants} = require('ggejs');
const {getLocalizations} = require("../../../../tools/localization");
const {formatNum} = require("../../../../tools/number");
const {getBuildingImage} = require("./utils");
const {buildingNames, buildingDescriptions} = require("./data");

/**
 *
 * @param {Building} data
 * @param {Locale} locale
 * @return {{title: string, description?: string, fields?: {name: string, value:string, inline?: boolean}[], thumbnailUrl?:string}}
 */
module.exports.getBuildingInfoEmbedData = function (data, locale) {
    const stringWod = data.wodID.toString();
    const fields = [];

    //#region old way creating fields
    let values = "";
    let constructionValues = "";
    let rewardValues = "";
    let storageValues = "";
    let productionValues = "";
    let protectionValues = "";
    let requirementsValues = "";
    let destructionValues = "";
    let sellValues = "";
    const _keys = Object.keys(data);
    for (let _key of _keys) {
        let _keyLowCase = _key.toLowerCase();
        if (_keyLowCase.endsWith("wodid") || _keyLowCase === "name" || _keyLowCase === "level" || _keyLowCase === "type" || _keyLowCase === "group" || _keyLowCase === "height" || (_keyLowCase.includes("cost") && _keyLowCase !== "buildingcostreduction") || _keyLowCase === "rotatetype" || _keyLowCase === "foodratio" || _keyLowCase.endsWith("duration") || _keyLowCase === "tempservertime" || _keyLowCase.startsWith("comment") || _keyLowCase === "shopcategory" || _keyLowCase === "constructionitemgroupids" || _keyLowCase === "buildinggroundtype" || _keyLowCase.endsWith("sortorder") || _keyLowCase === "effectlocked" || _keyLowCase.startsWith("earlyunlock") || _keyLowCase === "eventIDs" || _keyLowCase === "slumlevelneeded" || _keyLowCase === "requiredprivateoffer" || _keyLowCase === "canbeprimesaleoffer" || _keyLowCase === "isdistrict" || _keyLowCase === "movable") continue;
        if (_keyLowCase.startsWith("tempserver")) _keyLowCase = _keyLowCase.replace("tempserver", `${getLocalizations(["dialogs", "temp_server_name"])[locale]} `);
        /** @type {string | number} */
        let _value = data[_key];
        if (_keyLowCase === "width") {
            _value = `${data.width}x${data.height}`;
            constructionValues += `**${getLocalizations(["dialogs", "gridSize"])[locale]}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "storeable") {
            _value = _value = data.storeable === 1 ? getLocalizations(["generic_flash", "button", "generic_btn_yes"])[locale] : getLocalizations(["generic_flash", "button", "generic_btn_no"])[locale];
            constructionValues += `**Opslaanbaar**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase.startsWith("required")) {
            _keyLowCase = _keyLowCase.substring(8, 9) + _key.substring(9);
            requirementsValues += `**${getLocalizations(["generic", _keyLowCase])[locale]}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "sceatskilllocked") {
            _value = data.sceatSkillLocked > 0 ? getLocalizations(["generic_flash", "button", "generic_btn_yes"])[locale] : getLocalizations(["generic_flash", "button", "generic_btn_no"])[locale];
            requirementsValues += `**Zaal vaardigheid nodig**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase.startsWith("sell")) {
            if (_key.length === 6) _key = _key.replace("sellC", "sellcurrency");
            sellValues += `**${getLocalizations(["dialogs", `currency_name_${_key.substring(4)}`])[locale]}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "kids") {
            let _valueArray = typeof (_value) === "number" ? [_value] : _value.split(',').map(v => parseInt(v.trim()));
            _value = "";
            for (let i = 0; i < _valueArray.length; i++) {
                if (i > 0) _value += ", ";
                switch (_valueArray[i]) {
                    case Constants.Kingdom.Classic:
                        _value += getLocalizations(["generic", "kingdomName_Classic"])[locale];
                        break;
                    case Constants.Kingdom.Icecream:
                        _value += getLocalizations(["generic", "kingdomName_Icecream"])[locale];
                        break;
                    case Constants.Kingdom.Desert:
                        _value += getLocalizations(["generic", "kingdomName_Dessert"])[locale];
                        break;
                    case Constants.Kingdom.Volcano:
                        _value += getLocalizations(["generic", "kingdomName_Volcano"])[locale];
                        break;
                    case Constants.Kingdom.Island:
                        _value += getLocalizations(["generic", "kingdomName_Island"])[locale];
                        break;
                    case Constants.Kingdom.Faction:
                        _value += getLocalizations(["generic", "kingdomName_Faction"])[locale];
                        break;
                    ///case "..": _value += translationData.generic.kingdomName_Classic_Maya; break;
                    default:
                        _value += _valueArray[i];
                        break;
                }
            }
            constructionValues += `**Toegestane koninkrijken**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "onlyinareatypes") {
            let _valueArray = typeof (_value) === "number" ? [_value] : _value.split(',').map(v => parseInt(v.trim()));
            _value = "";
            for (let i = 0; i < _valueArray.length; i++) {
                if (i > 0) _value += ", ";
                switch (_valueArray[i]) {
                    case Constants.WorldmapArea.MainCastle:
                        _value += "Hoofdkasteel";
                        break;
                    case Constants.WorldmapArea.Capital:
                        _value += getLocalizations(["generic", "capital"])[locale];
                        break;
                    case Constants.WorldmapArea.Outpost:
                        _value += getLocalizations(["generic", "outpost"])[locale];
                        break;
                    case Constants.WorldmapArea.KingdomCastle:
                        _value += getLocalizations(["generic", "kingdomCastle_name"])[locale];
                        break;
                    case Constants.WorldmapArea.Metropol:
                        _value += getLocalizations(["generic", "metropol"])[locale];
                        break;
                    case Constants.WorldmapArea.Kingstower:
                        _value += getLocalizations(["generic", "kingstower"])[locale];
                        break;
                    case Constants.WorldmapArea.Monument:
                        _value += getLocalizations(["generic", "monument"])[locale];
                        break;
                    default:
                        _value += _valueArray[i];
                        break;
                }
            }
            constructionValues += `**Toegestane kastelen**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "mightvalue") {
            _keyLowCase = getLocalizations(["dialogs", "mightPoints"])[locale];
            rewardValues += `**${_keyLowCase}**: ${formatNum(data.mightValue, locale)}\n`;
            continue;
        }
        if (_keyLowCase === "xp") {
            _keyLowCase = getLocalizations(["generic", "xp"])[locale];
            rewardValues += `**${_keyLowCase}**: ${formatNum(data.xp, locale)}\n`;
            continue;
        }
        if (_keyLowCase === "moral") {
            _keyLowCase = getLocalizations(["generic", "morality"])[locale];
            rewardValues += `**${_keyLowCase}**: ${formatNum(data.Moral, locale)}\n`;
            continue;
        }
        if (_keyLowCase === "buildspeedboost") {
            _keyLowCase = getLocalizations(["generic", "buildingSpeed"])[locale];
            _value = `+${data.buildSpeedBoost}%`;
            rewardValues += `**${_keyLowCase}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "kingdomfameboost") {
            _keyLowCase = getLocalizations(["dialogs", "dialog_fame_title"])[locale];
            _value = `+${data.kingdomFameBoost}%`;
            rewardValues += `**${_keyLowCase}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "decopoints") {
            _keyLowCase = getLocalizations(["generic", "publicOrder"])[locale];
            rewardValues += `**${_keyLowCase}**: ${formatNum(data.decoPoints, locale)}\n`;
            continue;
        }
        if (_keyLowCase === "hunterratio") {
            _value = `${data.hunterRatio / 100} ${getLocalizations(["generic", "goods"])[locale]} geeft 1 ${getLocalizations(["generic", "food"])[locale]}`;
            _keyLowCase = getLocalizations(["dialogs", "dialog_hunter_exchangeRate"])[locale];
            rewardValues += `**${_keyLowCase}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "honeyratio") {
            _value = `${data.honeyRatio} ${getLocalizations(["generic", "honey"])[locale]} en ${data.foodRatio} ${getLocalizations(["generic", "food"])[locale]} geven samen 1 ${getLocalizations(["generic", "mead"])[locale]}`;
            _keyLowCase = getLocalizations(["dialogs", "dialog_hunter_exchangeRate"])[locale];
            rewardValues += `**${_keyLowCase}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "unitwallcount") {
            _keyLowCase = getLocalizations(["dialogs", "ci_effect_unitWallCount_tt"])[locale]
            _keyLowCase = _keyLowCase.substring(0, _keyLowCase.length - 1);
            _value = `+${data.unitWallCount}`;
            rewardValues += `**${_keyLowCase}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "skillpoints") {
            _keyLowCase = getLocalizations(["dialogs", "dialog_legendTemple_SkillPointPlural"])[locale]
            rewardValues += `**${_keyLowCase}**: ${data.skillPoints}\n`;
            continue;
        }
        if (_keyLowCase.endsWith("storage")) {
            storageValues += `**${getLocalizations(["generic", _keyLowCase.substring(0, _keyLowCase.length - 7)])[locale]}**: ${formatNum(data[_key], locale)}\n`;
            continue;
        }
        if (_keyLowCase.endsWith("boost")) {
            productionValues += `**${getLocalizations(["generic", _keyLowCase.substring(0, _keyLowCase.length - 5)])[locale]} boost**: ${formatNum(data[_key], locale)}%\n`;
            continue;
        }
        if (_key === "Hideout") {
            storageValues += `**Beveiligde opslag**: ${formatNum(data.Hideout, locale)}\n`;
            continue;
        }
        if (_key === "aquamarineHideout") {
            storageValues += `**Beveiligde opslag ${getLocalizations(["generic", "aquamarine"])[locale]}**: ${formatNum(data.aquamarineHideout, locale)}\n`;
            continue;
        }
        if (_key === "islandAlliancePoints") {
            _keyLowCase = getLocalizations(["generic", "cargo_points"])[locale];
            _value = formatNum(data.islandAlliancePoints, locale);
        }
        if (_keyLowCase.endsWith("production")) {
            productionValues += `**${getLocalizations(["generic", _keyLowCase.substring(0, _keyLowCase.length - 10)])[locale]}**: ${formatNum(data[_key], locale)}\n`;
            continue;
        }
        if (_key === "alliFoodProductionBonus") {
            productionValues += `**${getLocalizations(["generic", "food"])[locale]}**: ${formatNum(data.alliFoodProductionBonus, locale)}\n`;
            continue;
        }
        if (_keyLowCase.startsWith("wall") || _keyLowCase.startsWith("gate") || _keyLowCase.startsWith("moat")) {
            protectionValues += `**${getLocalizations(["generic", _keyLowCase.substring(0, 4)])[locale]}**: +${formatNum(data[_key], locale)}%\n`;
            continue;
        }
        if (_keyLowCase.endsWith("burnable") || _keyLowCase.endsWith("destructable") || _keyLowCase.endsWith("smashable")) {

            _value = data[_key] === 1 ? getLocalizations(["generic_flash", "button", "generic_btn_yes"])[locale] : getLocalizations(["generic_flash", "button", "generic_btn_no"])[locale];
            if (_keyLowCase.endsWith("burnable")) _keyLowCase = _keyLowCase.replace("burnable", "brandbaar"); else if (_keyLowCase.endsWith("destructable")) _keyLowCase = _keyLowCase.replace("destructable", "afbreekbaar"); else if (_keyLowCase.endsWith("smashable")) _keyLowCase = _keyLowCase.replace("smashable", "verwoestbaar");
            _keyLowCase = _keyLowCase.substring(0, 1).toUpperCase() + _keyLowCase.substring(1);
            destructionValues += `**${_keyLowCase}**: ${_value}\n`;
            continue;
        }
        if (_keyLowCase === "maximumcount") {
            _keyLowCase = "Maximum aantal";
        }
        if (_keyLowCase === "districttypeid") {
            _keyLowCase = "Kan in district";
            switch (_value) {
                case 1:
                case "1":
                    _value = getLocalizations(["generic", "MilitaryDistrict_name"])[locale]
                    break;
                case 3:
                case "3":
                    _value = getLocalizations(["buildings_and_decorations", "InnerDistrict_name"])[locale]
                    break;
                case 4:
                case "4":
                    _value = getLocalizations(["dialogs", "TradeDistrict_name"])[locale]
                    break;
                default:
                    break;
            }
        }

        _keyLowCase = _keyLowCase.substring(0, 1).toUpperCase() + _keyLowCase.substring(1);
        if (_key.toLowerCase() !== _keyLowCase.toLowerCase()) _key = _keyLowCase;
        values += `**${_key}**: ${_value}\n`;
    }
    if (constructionValues !== "") {
        fields.push({name: `**Constructie**`, value: constructionValues.trim(), inline: true,});
    }
    if (requirementsValues !== "") {
        fields.push({
            name: `**${getLocalizations(["dialogs", "dialog_alliance_nobleHouse_req_title"])[locale]}**`,
            value: requirementsValues.trim(),
            inline: true
        });
    }
    if (rewardValues !== "") {
        fields.push({name: `**Voordelen**`, value: rewardValues.trim(), inline: true});
    }
    if (storageValues !== "") {
        fields.push({
            name: `**${getLocalizations(["buildings_and_decorations", "storehouse_name"])[locale]}**`,
            value: storageValues.trim(),
            inline: true
        });
    }
    if (productionValues !== "") {
        fields.push({
            name: `**${getLocalizations(["generic", "produce"])[locale]}**`,
            value: productionValues.trim(),
            inline: true
        });
    }
    if (protectionValues !== "") {
        fields.push({
            name: `**${getLocalizations(["generic", "protection"])[locale]}**`,
            value: protectionValues.trim(),
            inline: true
        });
    }
    if (sellValues !== "") {
        fields.push({
            name: `**${getLocalizations(["generic", "sellPrice"])[locale]}**`, value: sellValues.trim(), inline: true
        });
    }
    if (destructionValues !== "") {
        fields.push({name: `**Afbreekbaarheid**`, value: destructionValues.trim(), inline: true});
    }
    if (values.trim() !== "") {
        values = values.substring(0, 1000);
        fields.push({
            name: `**${getLocalizations(["generic", "restTab"])[locale]}**`, value: values.trim(), inline: true
        });
    }
    //#endregion

    return {
        title: decodeValue(buildingNames.find(n => n.raw === stringWod)[locale]),
        description: decodeValue(buildingDescriptions.find(n => n.raw === stringWod)[locale]),
        fields: fields,
        thumbnailUrl: getBuildingImage(data),
    };
}

/**
 *
 * @param {string} val
 * @return {string}
 */
function decodeValue(val) {
    try {
        return val.replaceAll('&#39;', '\'')
            .replaceAll('&amp;', '&')
            .replaceAll('&quot;', '"')
            .split('\n').map(s => s.trim()).join('\n').trim()
    }catch (e) {
        return val
    }
}