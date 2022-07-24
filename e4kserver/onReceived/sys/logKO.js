const Logger = require("../../../tools/Logger");

module.exports = {
    name: "logKO",
    execute(xml) {
        Logger.logError("LoginResponce failed!: " + xml.body.login.$.e);
    }
}