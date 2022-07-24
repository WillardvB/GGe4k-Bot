/**
 * 
 * @param {object} srcObj
 * @param {object} trgObj
 * @param {number} depth
 * @param {string} objName
 */
function _obj2xml(srcObj, trgObj = {}, depth = 0, objName = "") {
    let srcObjType = null;
    let objType = null;
    let _value;
    if (depth == 0) {
        trgObj.xmlStr = "<dataObj>" + this.eof;
    }
    else {
        srcObjType = typeof srcObj === Array ? "a" : "o";
        trgObj.xmlStr += "<obj t=\'" + srcObjType + "\' o=\'" + objName + "\'>";
    }
    for (var objName in srcObj) {
        objType = typeof srcObj[objName];
        _value = srcObj[objName];
        if (objType === "boolean" || objType === "number" || objType === "string" || objType === "null") {
            if (objType == "boolean") {
                _value = Number(_value);
            }
            else if (objType == "null") {
                objType = "x";
                _value = "";
            }
            trgObj.xmlStr += "<var n=\'" + objName + "\' t=\'" + objType.substr(0, 1) + "\'>" + _value + "</var>";
        }
        else if (objType == "object") {
            obj2xml(_value, trgObj, depth + 1, objName);
            trgObj.xmlStr += "</obj>";
        }
    }
    if (depth == 0) {
        trgObj.xmlStr += "</dataObj>";
    }
    return trgObj;
}

module.exports = {
    obj2xml(obj) {
        return _obj2xml(obj).xmlStr;
    }
}