const _ = require('ggejs')
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {Constants} = _;
const mail_data = require('../../data/owner/mailMessages.json')
const fs = require("fs/promises");
const path = require("path");
const ownerData = require('../data');
const mailMessages_filePath = path.join(__dirname, '../../data/owner/mailMessages.json');

/**
 * Converts Empire's mail messages to Discord Embeds and sends them to the bot owner
 * @param {_.Message} message
 * @return {Promise<void>}
 */
module.exports.handleMailMessage = async function (message) {
    if (mail_data["sent_mail_ids"].includes(message.messageId)) return;

    if (message.messageType === Constants.MessageType.UserIn) {
        const embed = new EmbedBuilder();
        embed.setTitle(message.subject);
        embed.setDescription(message.body);
        embed.setColor("#905000")
        embed.setAuthor({name: message.senderName});
        embed.setTimestamp(message.deliveryTime);
        const componentRow = new ActionRowBuilder();
        componentRow.addComponents(
            new ButtonBuilder().setCustomId(`MailMessage React ${message.messageId} to-modal`).setEmoji("📤").setLabel("React").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`MailMessage Delete ${message.messageId}`).setEmoji("🗑️").setLabel("Delete").setStyle(ButtonStyle.Danger)
        )
        await ownerData.owner.send({embeds: [embed], components: [componentRow]})
    } else return;

    mail_data["sent_mail_ids"].push(message.messageId);

    const buffer = await fs.readFile(mailMessages_filePath)
    const json = JSON.parse(buffer.toString());
    json[`sent_mail_ids`] = mail_data["sent_mail_ids"];
    await fs.writeFile(mailMessages_filePath, JSON.stringify(json, null, 2));
}