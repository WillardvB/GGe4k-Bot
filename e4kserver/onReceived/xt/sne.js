const logger = require('/app/tools/Logger.js');

module.exports = {
    name: "sne",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        if (params) {
            parseMessageInfoArray(params.MSG);
        }
    }
}

/**
 * 
 * @param {Array} params
 */
function parseMessageInfoArray(params) {
    if (!params) {
        return;
    }
    let _loc2_ = 0;
    while (_loc2_ < params.length) {
        parseMessageInfo(params[_loc2_]);
        _loc2_++;
    }
    //_incomingMails.sort(sortMessages);
    //messageListUpdatedSignal.dispatch();
}

/**
 * 
 * @param {Array} messageInfo
 */
function parseMessageInfo(messageInfo) {
    console.log("Message!");
    console.log(messageInfo);
    /*
    let _loc4_ = messageVOFactory.create(messageInfo);
    if (!_loc4_) {
        return;
    }
    let _loc2_ = true;
    let _loc3_ = 0;
    while (_loc3_ < _incomingMails.length) {
        if (_loc4_.messageID == _incomingMails[_loc3_].messageID) {
            _incomingMails[_loc3_] = _loc4_;
            _loc2_ = false;
            break;
        }
        _loc3_++;
    }
    if (_loc2_) {
        _incomingMails.push(_loc4_);
    }
    */
    //messageListUpdatedSignal.dispatch();
}