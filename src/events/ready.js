const { nlserver } = require('./../data/kanalen.json');
const { Client } = require('discord.js');

module.exports = {
    name: 'ready',
    description: 'Regelt ready event',
    execute(client) {
        require('./../tools/Logger').execute(client);
        require('./../empireClient').connect();
        weerOnline(client);
    }
}

/**
 * 
 * @param {Client} client
 */
async function weerOnline(client) {
    const _server = client.guilds.cache.find(guild => guild.id === nlserver.id);
    const server = await _server.fetch();
    let ik = await server.members.fetch('346015807496781825');
    ik.send({ content: 'Hey, ik ben weer online! 🙂' }).catch(e => console.log(e));
    client.user.setActivity({ type: "PLAYING", name: `Goodgame Empire (Four Kingdoms)` });
    console.log('Ready!');
    
    //require('./../tools/embedEditor.js').stuurRegelsBericht(client);
    //require('./../tools/embedEditor.js').stuurReactieRollenBericht(client);
}