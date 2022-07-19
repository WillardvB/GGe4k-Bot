const path = require('node:path');
const fs = require('fs');
const { setRoomList, onJoinRoom, getRoom, autoJoinRoom } = require('./../../room.js');

let _hasAutoJoined = false;

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
                if (!_hasAutoJoined) {
                    _hasAutoJoined = true;
                    autoJoinRoom();
                }
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
                console.log("allianceId: " + require('./../xt/ain').allianceId + " has some errors: " + e);
                require('./../../commands/searchAllianceById.js').execute(require('./../xt/ain').allianceId);
                return;
            }
            params = _jsonResponseVO.paramArray[0];
        }
        let error = _jsonResponseVO.error;
        handler.apply(this, [error, params]);
    }
    else {
        //console.log("[ERROR] Unknown xt command: " + cmd);
    }
}