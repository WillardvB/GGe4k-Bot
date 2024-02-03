const {EmbedBuilder} = require("discord.js");
const {getRawDataUrl} = require("./constants");

/**
 * Creates an object containing a Discord Embed and content-string based on embed info
 * @param {string} fileName
 * @param {ColorResolvable} color
 * @param {{title: string, description?: string, fields?: {name: string, value: string, inline?: boolean}[], thumbnailUrl?: string}} embedInfo Data for one or more embeds
 * @returns {{embeds: EmbedBuilder[]}}
 */
module.exports.buildEmbeds = function (fileName, color, ...embedInfo) {
    const message = {embeds: []}
    const embeds = [];
    let first = true;
    for (let data of embedInfo) {
        const embed = new EmbedBuilder()
            .setTitle(data.title)
            .setColor(color)
            .setTimestamp()
        if(data.description){
            embed.setDescription(data.description)
        }
        if (first) {
            embed.setURL(getRawDataUrl(fileName))
            first = false;
        }
        if (data.fields) embed.setFields(data.fields);
        if (data.thumbnailUrl) embed.setThumbnail(data.thumbnailUrl);
        embeds.push(embed);
    }
    message.embeds = embeds;
    return message
}