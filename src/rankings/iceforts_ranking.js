const fs = require("fs/promises");
const path = require("path");
const {Constants} = require('ggejs');
const iceForts_ranking_data_filePath = path.join(__dirname, '../data/rankings/iceforts_ranking_data.json');
const iceForts_ranking_data = require('../data/rankings/iceforts_ranking_data.json');

/**
 *
 * @param {Client} client
 * @return {Promise<void>}
 */
module.exports.execute = async function (client) {
    /** @type {Worldmap} */
    const worldmap_ice = await client.worldmaps.get(2);
    /** @type {BossDungeonMapobject[]} */
    const iceForts = worldmap_ice.mapobjects.filter(m => m.areaType === Constants.WorldmapArea.BossDungeon)
    const iceForts_data = iceForts.filter(d => d.attackCooldownEnd !== undefined).map(d => {
        return {
            pos: d.position.X * 10000 + d.position.Y,
            pId: d.defeaterPlayerId,
            time: Math.round(d.attackCooldownEnd.getTime() / 60000)
        }
    }).filter(d => iceForts_ranking_data.iceforts_data.find(d2 => d2.pos === d.pos && d2.time === d.time) === undefined)
    if (iceForts_data.length === 0) return;
    iceForts_ranking_data.iceforts_data.push(...iceForts_data)
    const buffer = await fs.readFile(iceForts_ranking_data_filePath)
    const json = JSON.parse(buffer.toString());
    json.iceforts_data = iceForts_ranking_data.iceforts_data;
    await fs.writeFile(iceForts_ranking_data_filePath, JSON.stringify(json, null, 2));
    //await updateDiscordRanking(client)
}