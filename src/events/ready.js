const {ActivityType, Client} = require('discord.js');
const ownerData = require('../owner/data');

const schedule = require('node-schedule')
const {deleteOldPrimeTimes} = require("../other/primetime");

module.exports.name = 'ready';
module.exports.description = 'Regelt ready event';
/**
 *
 * @param {Client} client
 * @returns {Promise<Client>}
 */
module.exports.execute = async function (client) {
    await ownerData.__init();
    //await (require('./../dc_commands/_slash/commandHelpers/worldmap').loadImages)();
    await weerOnline(client);
    require("./../communityhub/index");
    await (require("../game_guide/sendButtonMessages").sendGameGuideButtonMessages)();

    // Every Day
    //schedule.scheduleJob('0 0 * * *', async () => {
    //})

    // Every Hour
    schedule.scheduleJob('0 * * * *', async () => {
        try {
            await deleteOldPrimeTimes()
        } catch (e) {
        }
    })
}

/**
 *
 * @param {Client} client
 */
async function weerOnline(client) {
    await ownerData.owner.send({content: 'Hey, ik ben weer online! 🙂'}).catch(e => console.log(e));
    client.user.setActivity({
        name: `GoodGame Empire (Four Kingdoms)`, url: 'https://empire.goodgamestudios.com/', type: ActivityType.Playing
    });
    console.log('Ready!');
}