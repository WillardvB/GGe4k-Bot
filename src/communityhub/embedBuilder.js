const {EmbedBuilder} = require("discord.js");

/**
 * Creates an object containing a Discord Embed and content-string based on announcement data
 * @param {AnnouncementData} announcementData All data of the announcement
 * @returns {{content: string, embeds: EmbedBuilder[]}}
 */
module.exports.buildEmbed = function (announcementData) {
    const message = {content: "", embeds: []}
    const embed = new EmbedBuilder();
    embed.setTitle(announcementData.title).setURL(announcementData.url);
    if (announcementData.text.length > 1024) {
        announcementData.text = `${announcementData.text.substring(0, 1021)}...`
    }
    embed.setDescription(announcementData.text);
    embed.setColor("#ffc020")
    if (announcementData.author) embed.setAuthor({name: announcementData.author});
    if (announcementData.time) embed.setTimestamp(announcementData.time);
    for(let i in announcementData.fields){
        if (announcementData.fields[i].value.length > 1024) {
            announcementData.fields[i].value = `${announcementData.fields[i].value.substring(0, 1021)}...`
        }
    }
    if (announcementData.fields) { // noinspection JSCheckFunctionSignatures
        embed.setFields(announcementData.fields);
    }
    if (announcementData.imageUrl) embed.setImage(announcementData.imageUrl);
    if (announcementData.videoUrl) message.content = announcementData.videoUrl;
    message.embeds = [embed];
    return message
}