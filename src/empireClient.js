const { Client: EmpireClient } = require("ggejs");
const empireClient = new EmpireClient("e4k-nl", process.env.empirePassword, true);

async function connect(){
    await empireClient.connect();
}

module.exports = {
    empireClient: empireClient,
    connect,
}