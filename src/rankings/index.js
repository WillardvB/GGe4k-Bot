const {client} = require("../e4kClient");
const {execute: dragonRanking} = require("./dragons_ranking");
const {execute: desertFortRanking} = require("./desertforts_ranking");
const {execute: iceFortRanking} = require("./iceforts_ranking");

/** @typedef {{imageUrl: string | null, videoUrl: string | null, author: string | null, text: string | null, time: Date | null, title: string, fields: {name: string, value: string}[] | null, url: string}} AnnouncementData */

(async () => {
    try {
        return;
        let busy = false
        await runAllRankings(client)
        setInterval(async () => {
            try {
                if (busy) return;
                busy = true;
                await runAllRankings(client)
            } catch (e) {
                console.log(e);
            }
            busy = false;
        }, 60000)
    } catch (e) {
        console.log(e);
    }
})()

async function runAllRankings(client) {
    await dragonRanking(client);
    await desertFortRanking(client);
    await iceFortRanking(client);
}