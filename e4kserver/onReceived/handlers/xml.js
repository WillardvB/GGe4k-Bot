module.exports = {
    execute() {
        let xml = stringToXml(msg);
        let type = (_loc6_ = xml.msg).$.t;
        if (type == "xt") {
            xtHandleMessage(_loc6_)
        }
        else if (type == "sys") {
            require('./../../data').sysHandleMessage(_loc6_);
        }
    }
}

/**
 * 
 * @param {any} msgObj
 */
function xtHandleMessage(msgObj) {
    let action = null;
    let _loc7_ = null;
    let _loc5_ = null;
    action = msgObj.body["$"].action;
    _loc8_ = msgObj.body["$"].id;
    if (action == "xtRes") {
        console.log("xtRes")
        console.log(_loc7_);
        _loc7_ = msgObj.body.toString();
        _loc5_ = ObjectSerializer.getInstance().deserialize(_loc7_);
        let event = {
            dataObj: _loc5_,
            type: "xml",
        }
        require('./../../data').onExtensionResponse(event);
    }
}