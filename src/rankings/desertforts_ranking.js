const fs = require("fs/promises");
const path = require("path");
const {Constants} = require('ggejs');
const desertForts_ranking_data_filePath = path.join(__dirname, '../data/rankings/desertforts_ranking_data.json');
const desertForts_ranking_data = require('../data/rankings/desertforts_ranking_data.json');

/**
 *
 * @param {Client} client
 * @return {Promise<void>}
 */
module.exports.execute = async function (client) {
    /** @type {Worldmap} */
    const worldmap_desert = await client.worldmaps.get(1);
    /** @type {BossDungeonMapobject[]} */
    const desertForts = worldmap_desert.mapobjects.filter(m => m.areaType === Constants.WorldmapArea.BossDungeon)
    const desertForts_data = desertForts.filter(d => d.attackCooldownEnd !== undefined).map(d => {
        return {
            pos: d.position.X * 10000 + d.position.Y,
            pId: d.defeaterPlayerId,
            time: Math.round(d.attackCooldownEnd.getTime() / 60000)
        }
    }).filter(d => desertForts_ranking_data.desertforts_data.find(d2 => d2.pos === d.pos && d2.time === d.time) === undefined)
    if (desertForts_data.length === 0) return;
    desertForts_ranking_data.desertforts_data.push(...desertForts_data)
    const buffer = await fs.readFile(desertForts_ranking_data_filePath)
    const json = JSON.parse(buffer.toString());
    json.desertforts_data = desertForts_ranking_data.desertforts_data;
    await fs.writeFile(desertForts_ranking_data_filePath, JSON.stringify(json, null, 2));
    //await updateDiscordRanking(client)
}