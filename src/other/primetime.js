const fs = require("fs/promises");
const path = require("path");
const prime_data = require('../data/other/prime_data.json')
const {EmbedBuilder, Message, Collection, Snowflake} = require("discord.js");
const {imageBaseUrl, imageData} = require("e4k-data");
const prime_data_filePath = path.join(__dirname, '../data/other/prime_data.json')

let primeChannel = null;

/**
 *
 * @param {PrimeTime} p
 * @return {Promise<void>}
 */
module.exports.handlePrimeTime = async function (p) {
    if (!p.isGlobal && p.premiumBonus !== 0) return;
    let pt = {
        premiumBonus: p.premiumBonus, endTime: Math.round(p.endTime.getTime() / 60000)
    }
    if (prime_data.sentPrimeTimes.find(pt2 => pt2.premiumBonus === pt.premiumBonus && pt2.endTime === pt.endTime) !== undefined) return;

    if (primeChannel == null) primeChannel = await (require("../index").dcClient.channels.fetch)("1161394133081002025")

    await primeChannel.send({
        embeds: [new EmbedBuilder()
            .setTitle("Prime Time")
            .setColor("#D2042D")
            .setThumbnail(imageBaseUrl + imageData.Teaser_OffersHub_Squared_1.url)
            .setDescription(`**+${p.premiumBonus}%**\nDuurt tot: <t:${Math.round(p.endTime.getTime() / 1000)}:F>`)]
    })

    prime_data.sentPrimeTimes.push(pt)
    const buffer = await fs.readFile(prime_data_filePath)
    const json = JSON.parse(buffer.toString());
    json.sentPrimeTimes = prime_data.sentPrimeTimes;
    await fs.writeFile(prime_data_filePath, JSON.stringify(json, null, 2));
}

module.exports.deleteOldPrimeTimes = async function () {
    /** @type {Guild}*/
    let guild = require('../index').dcClient.guilds.cache.find(guild => guild.id === '1161026424422027305');
    const primeChannel = await guild.channels.fetch('1161026426858918028');
    let finished = false
    let beforeId = 0;
    while (!finished) {
        const settings = beforeId === 0 ? {limit: 100} : {limit: 100, beforeId: beforeId};
        /** @type {Collection<Snowflake, Message<true>>}*/
        const messageCollection = (await primeChannel.messages.fetch(settings));
        /** @type {Message<true>[]} */
        const messages = messageCollection.map((v, _, __) => v);
        const filtered = messages.filter(m => m.content.startsWith('@Prime Time'))
        const oldPrimeMessages = filtered.filter(m => m.createdTimestamp < Date.now() - (24 * 60 * 60 * 1000))
        finished = oldPrimeMessages.length === 0
        for (let m of oldPrimeMessages) await m.delete()
        beforeId = messages.findLast(m => !m.content.startsWith('@Prime Time')).id
    }
}