const { Client: EmpireClient } = require("ggejs");
let _empireClient = new EmpireClient("", "");

async function _connect() {
    _empireClient = new EmpireClient("e4k-nl", process.env.empirePassword, true);
    await _empireClient.connect();
}

module.exports = {
    get client() { return _empireClient },
    connect() {
        _connect();
    }
}