const path = require('node:path');
const fs = require('fs');
const { setRoomList, onJoinRoom, getRoom } = require('./../../room.js');
const { execute: searchByAllianceId } = require('./../../commands/searchAllianceById.js');

let commands = [];
const commandsPath = path.join(__dirname, '../xt');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands[command.name] = command.execute;
}

module.exports = {
    /**
     * 
     * @param {object} event
     */
    onResponse(event) {
        /** @type Array */
        let params = [];
        let command = (params = event.dataObj).shift();
        switch (command) {
            case "rlu":
                setRoomList(params);
                return;
            case "jro":
                onJoinRoom({ params: { "room": getRoom(parseInt(params.shift())) } });
                return;
            default:
                params.shift();
                let responseVO = {
                    error: params.shift(),
                    commandID: command,
                    paramArray: params,
                }
                executeResponse(responseVO);
                return;
        }
    }
}

/**
 * 
 * @param {object} _jsonResponseVO
 */
function executeResponse(_jsonResponseVO) {
    let cmd = _jsonResponseVO.commandID.toLowerCase();
    let handler = commands[cmd];
    if (handler != null) {
        let params;
        try {
            params = JSON.parse(_jsonResponseVO.paramArray[0]);
        } catch (e) {
            if (cmd == "ain") {
                searchByAllianceId(allianceId);
                return;
            }
            params = _jsonResponseVO.paramArray[0];
        }
        let error = _jsonResponseVO.error;
        handler.apply(this, [error, params]);
    }
    else {
        console.log("[ERROR] Unknown xt command: " + cmd);
    }
    /*switch (_jsonResponseVO.commandID.toLowerCase()) {
        case "core_nfo": processResponseCoreNFO(params); break;
        case "core_lga": processResponseCoreLGA(_jsonResponseVO.error, JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "core_gfl": processResponseCoreGFL(_jsonResponseVO.error, _jsonResponseVO.paramArray[0]); break;
        case "gmu": processResponseGMU(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "ufa": processResponseUFA(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "ufp": processResponseUFP(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "gus": processResponseGUS(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "tse": processResponseTSE(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "lfe": processResponseLFE(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "ftf": processResponseFTF(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "gam": processResponseGAM(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "nec": processResponseNEC(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "pre": processResponsePRE(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "gls": processResponseGLS(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "gbd": processResponseGBD(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "gpi": processResponseGPI(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "upi": processResponseUPI(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "gem": processResponseGEM(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "uar": processResponseUAR(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "irc": processResponseIRC(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "ato": processResponseATO(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "aas": processResponseAAS(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        case "pin": processResponsePIN(_jsonResponseVO.error, _jsonResponseVO.paramArray[0]); break;
        case "wsp": processResponseWSP(JSON.parse(_jsonResponseVO.paramArray[0])); break;
        default: console.log("Er is not geen processResponse functie voor " + _jsonResponseVO.commandID); break;
    }*/
}