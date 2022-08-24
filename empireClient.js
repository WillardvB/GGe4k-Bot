const { Client: EmpireClient } = require("empirejs");
const empireClient = new EmpireClient("e4k-nl", process.env.empirePassword);

async function connect(){
    await empireClient.connect();
}

module.exports = {
    empireClient: empireClient,
    connect,
}