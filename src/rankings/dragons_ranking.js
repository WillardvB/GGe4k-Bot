const fs = require("fs/promises");
const path = require("path");
const {Constants} = require('ggejs');
const {imageBaseUrl, imageData} = require('e4k-data');
const {createCanvas, loadImage} = require("canvas");
const {AttachmentBuilder, EmbedBuilder} = require("discord.js");
const dragons_ranking_data_filePath = path.join(__dirname, '../data/rankings/dragons_ranking_data.json');
const dragons_ranking_data = require('../data/rankings/dragons_ranking_data.json');

let e4kRankingsChannel = null;

/**
 *
 * @param {Client} client
 * @return {Promise<void>}
 */
module.exports.execute = async function (client) {
    /** @type {Worldmap} */
    const worldmap_fire = await client.worldmaps.get(3);
    /** @type {BossDungeonMapobject[]} */
    const dragons = worldmap_fire.mapobjects.filter(m => m.areaType === Constants.WorldmapArea.BossDungeon)
    const dragon_data = dragons.filter(d => d.attackCooldownEnd !== undefined).map(d => {
        return {
            pos: d.position.X * 10000 + d.position.Y,
            pId: d.defeaterPlayerId,
            time: Math.round(d.attackCooldownEnd.getTime() / 60000)
        }
    }).filter(d => dragons_ranking_data.dragon_data.find(d2 => d2.pos === d.pos && d2.time === d.time) === undefined)
    if (dragon_data.length === 0) return;
    dragons_ranking_data.dragon_data.push(...dragon_data)
    const buffer = await fs.readFile(dragons_ranking_data_filePath)
    const json = JSON.parse(buffer.toString());
    json.dragon_data = dragons_ranking_data.dragon_data;
    await fs.writeFile(dragons_ranking_data_filePath, JSON.stringify(json, null, 2));
    await updateDiscordRanking(client)
}

/**
 *
 * @param {Client} client
 * @return {Promise<void>}
 */
async function updateDiscordRanking(client) {
    /** @type {[{pid:number,count:number}]} */
    const dragonsPerPlayer = [];
    for (let i of dragons_ranking_data.dragon_data) {
        const dpp = dragonsPerPlayer.find(_dpp => _dpp.pid === i.pId)
        if (dpp == null) dragonsPerPlayer.push({pid: i.pId, count: 1}); else dpp.count += 1;
    }

    const dragonRanking = dragonsPerPlayer.sort((a, b) => b.count - a.count);

    const background = await loadImage(imageBaseUrl + imageData.Teaser_OffersHub_Medium_14.url)
    const canvas = createCanvas(background.width, background.height)
    const ctx = canvas.getContext("2d")
    ctx.drawImage(background, 0, 0)

    ctx.font = `87.5px sans-serif`;
    drawStrokedText(ctx, "Naam", 750, canvas.height / 8 * 1.875, "#000", "#EEE", 5);
    drawStrokedText(ctx, "Draken", 1220, canvas.height / 8 * 1.875, "#000", "#EEE", 5);

    for (let i = 0; i < 3; i++) {
        const y = canvas.height / 8 * (i * 1.70 + 2.90)
        const glowColor = i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32"
        ctx.font = `100px sans-serif`;
        ctx.fillStyle = "#000"
        ctx.textBaseline = "middle";
        drawGlowingText(ctx, `${i + 1}.`, 650, y, glowColor, 15)
        drawGlowingText(ctx, dragonRanking[i].count.toString(), 1300, y, glowColor, 15)

        const player = await client.players.getById(dragonRanking[i].pid);
        ctx.font = applyText(canvas, player.playerName, 100, 550);
        drawGlowingText(ctx, player.playerName, 750, y, glowColor, 15);
    }

    if (e4kRankingsChannel == null) e4kRankingsChannel = await (require("../index").dcClient.channels.fetch)("1161389781184430171")

    const playerNames = [];
    let longestNameLength = 0;
    for (let i = 3; i < 15; i++) {
        const player = await client.players.getById(dragonRanking[i].pid);
        playerNames.push(player.playerName);
        longestNameLength = Math.max(longestNameLength, player.playerName.length)
    }

    let dragons_top15 = ""
    for (let i = 3; i < 15; i++) {
        const playerName = playerNames[i - 3];
        const spaceCount = longestNameLength - playerName.length;
        let spaces = ' ';
        for (let i = 0; i < spaceCount; i++) {
            spaces += ' ';
        }
        dragons_top15 += `${i + 1}. \`${playerName}${spaces}- ${dragonRanking[i].count}\`\n`
    }
    dragons_top15 = dragons_top15.trim();

    /** @type {Message} */
    const message1 = await e4kRankingsChannel.messages.fetch('1161391074426769430');
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: 'Dragons Top3.png'});
    await message1.edit({content: '# Drakenjagersklassement', files: [attachment]})

    /** @type {Message} */
    const message2 = await e4kRankingsChannel.messages.fetch('1161391076129652783');
    await message2.edit({embeds: [new EmbedBuilder().setDescription(dragons_top15).setFooter({text: "Gegevens sinds 09-10-2023"}).setTimestamp()]})
}

/**
 *
 * @param {Canvas} canvas
 * @param {string} text
 * @param {number} maxFontSize
 * @param {number} availableWidth
 * @return {string}
 */
function applyText(canvas, text, maxFontSize, availableWidth) {
    const context = canvas.getContext('2d');
    let fontSize = maxFontSize;
    do {
        context.font = `${fontSize -= 10}px sans-serif`;
    } while (context.measureText(text).width > availableWidth);
    return context.font;
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {string | CanvasGradient | CanvasPattern} fillStyle
 * @param {string | CanvasGradient | CanvasPattern} strokeStyle
 * @param {number} lineWidth
 */
function drawStrokedText(ctx, text, x, y, fillStyle = "#FFF", strokeStyle = "#000", lineWidth = 8) {
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
    ctx.restore();
}

function drawGlowingText(ctx, text, x, y, glowColorHexString, glowDistance = 10) {
    ctx.save();
    ctx.shadowBlur = glowDistance;
    ctx.shadowColor = glowColorHexString;
    ctx.strokeText(text, x, y);
    for (let i = 0; i < 3; i++) ctx.fillText(text, x, y); //seems to be washed out without three fills
    ctx.restore();
}