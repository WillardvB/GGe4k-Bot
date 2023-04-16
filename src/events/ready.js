const {nlserver} = require('./../data/kanalen.json');
const {ActivityType, Client} = require('discord.js');
const empire = require('./../empireClient');
const translationData = require('e4k-data').languages.nl;

module.exports = {
    name: 'ready',
    description: 'Regelt ready event',
    /**
     *
     * @param {Client} client
     * @returns {Promise<Client>}
     */
    async execute(client) {
        await require('./../tools/Logger').execute(client);
        await empire.connect();
        empire.client.on('serverShutdown', async () => {
            /** @type {Guild}*/
            let guild = client.guilds.cache.find(guild => guild.id === nlserver.id);
            let channel = await guild.channels.fetch('882702761756598312');
            await channel.send({content: translationData.generic_flash.alert.generic_alert_connection_lost_description});
        })
        empire.client.on('serverShutdownEnd', async () => {
            /** @type {Guild}*/
            let guild = client.guilds.cache.find(guild => guild.id === nlserver.id);
            let channel = await guild.channels.fetch('882702761756598312');
            await channel.send({content: "Onderhoud is voorbij. De server is weer bereikbaar."})
        })
        await require('./../dc_commands/_slash/commandHelpers/worldmap').loadImages();
        await weerOnline(client);
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
    ik.send({content: 'Hey, ik ben weer online! 🙂'}).catch(e => console.log(e));
    client.user.setActivity({
        name: `GoodGame Empire (Four Kingdoms)`,
        url: 'https://empire.goodgamestudios.com/',
        type: ActivityType.Playing,
    });
    console.log('Ready!');

    //require('./../tools/embedEditor.js').stuurRegelsBericht(client);
    //require('./../tools/embedEditor.js').stuurReactieRollenBericht(client);
}