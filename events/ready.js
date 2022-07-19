const { nlserver } = require('./../data/kanalen.json');
const googleSheet = require('./../data/googleSpreadSheetData.js');
const embedEditor = require('./../tools/embedEditor.js');
const { Client } = require('discord.js');
let client1;

module.exports = {
    name: 'ready',
    description: 'Regelt ready event',
    execute(client) {
        require('./../tools/Logger').execute(client);
        //require('./../e4kserver/connection').execute();
        client1 = client;
        weerOnline(client);
        setInterval(elkeXSec, 1000);
    }
}

function elkeXSec() {
    client1.commands.get("plan").execute(client1);
}

/**
 * 
 * @param {Client} client
 */
async function weerOnline(client) {
    const server = client.guilds.cache.find(guild => guild.id == nlserver.id);
    await server.members.fetch();
    await server.channels.cache.forEach(channel => {
        fetchMessagesFrom(client, channel.id, 5);
    });
    const ik = server.members.cache.find(member => member.id == "346015807496781825");
    ik.send({ content: 'Hey, ik ben weer online! 🙂' }).catch(e => console.log(e));
    client.user.setActivity({ type: "PLAYING", name: `Goodgame Empire (Four Kingdoms)` });
    console.log('Ready!');
    await googleSheet.gebouwData(client);
    await googleSheet.titelData(client);
    await googleSheet.rrData(client);
    await googleSheet.rrAttData(client);
    
    //embedEditor.stuurRegelsBericht(client);
    //embedEditor.stuurReactieRollenBericht(client);
}

async function fetchMessagesFrom(client, kanaalID, aantalMsgX100) {
    const kanaal = client.channels.cache.find(channel => channel.id == kanaalID);
    if (kanaal == null) {
        return;
    }
    let options = { limit: 100 };
    for (let u = 0; u < aantalMsgX100; u++) {
        if (u != 0 && laatsteMessageID != null) {
            options.before = laatsteMessageID;
        }
        else if (u != 0 && laatsteMessageID == null) {
            return;
        }
        if (kanaal.messages == null) {
            return;
        }
        await kanaal.messages.fetch(options)
            .then(msgs => {
                laatsteMessageID = msgs.last().id;
            })
            .catch(e => {
                u = 10000;
                return;
            })
    }
}