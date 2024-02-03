const {fetchAnnouncements, fetchAnnouncement} = require("./announcementFetcher");
const fs = require('fs/promises')
const hub_data = require('../data/communityhub/hub_data.json');
const {buildEmbed} = require("./embedBuilder");
const {dcClient} = require("../index");
const path = require("path");

const hub_data_filePath = path.join(__dirname, '../data/communityhub/hub_data.json');

/** @type {{[p:string]: GuildChannel | ThreadChannel}} */
const channels = {
    "e4k": null, "empire": null
};
/** @type {{[p:string]: string}} */
const roleIds = {
    "e4k": "", "empire": ""
};

/** @typedef {{imageUrl: string | null, videoUrl: string | null, author: string | null, text: string | null, time: Date | null, title: string, fields: {name: string, value: string}[] | null, url: string}} AnnouncementData */

(async () => {
    try {
        /** @type {Guild} */
        const _server = dcClient.guilds.cache.find(guild => guild.id === require('../data/kanalen.json').nlserver.id);
        const server = await _server.fetch();
        for (let n in channels) {
            channels[n] = await server.channels.fetch(hub_data.discord_channel_ids[n]);
        }
        for (let n in roleIds) {
            roleIds[n] = hub_data.discord_role_ids[n];
        }
        await checkCommunityHub()
        setInterval(async () => {
            try {
                await checkCommunityHub()
            } catch (e) {
                console.log(e);
            }
        }, 60000);
    } catch (e) {
        console.log(e);
    }
})()

/** @return {Promise<void>} */
async function checkCommunityHub() {
    await sendMissingPosts("e4k");
    await sendMissingPosts("empire")
}

/**
 *
 * @param {"e4k" | "empire" | "bigfarm" | "bitlife"} game
 * @return {Promise<void>}
 */
async function sendMissingPosts(game) {
    const announcementsData = await fetchAnnouncements(game);
    /** @type {AnnouncementData[]} */
    let missingAnnouncements = []
    for (let aData of announcementsData) {
        if (hub_data[`sent_urls_${game}`].includes(aData.url)) continue;
        try {
            const a = await fetchAnnouncement(aData.url)
            if (a.imageUrl === 'https://communityhub.goodgamestudios.com/wp-content/uploads/2023/11/DiscordText-2.png') {
                a.imageUrl = aData.imageUrl
            }
            missingAnnouncements.push(a);
        } catch (_) {
        }
    }
    missingAnnouncements = missingAnnouncements.sort((a, b) => a.time - b.time)
    for (let a of missingAnnouncements) {
        try {
            if (a == null) continue
            const data = buildEmbed(a);
            if (data.embeds.length > 0) {
                const message = await channels[game].send({content: `<@&${roleIds[game]}>`, embeds: data.embeds});
                await message.crosspost()
            }
            if (data.content !== "") {
                const message = await channels[game].send({content: data.content});
                await message.crosspost()
            }
            hub_data[`sent_urls_${game}`].push(a.url);
        } catch (e) {
            console.log(e);
        }
    }
    const buffer = await fs.readFile(hub_data_filePath)
    const json = JSON.parse(buffer.toString());
    json[`sent_urls_${game}`] = hub_data[`sent_urls_${game}`];
    await fs.writeFile(hub_data_filePath, JSON.stringify(json, null, 2));
}