const {Client, Constants} = require("ggejs");
const {nlserver} = require('./data/kanalen.json');
const {handleMailMessage} = require("./owner/empireToDiscord/mailMessage");
const {handlePrimeTime} = require("./other/primetime");
const networkInstances = require('e4k-data').network.instances.instance;
const dutchNetworkInstance = networkInstances.find(i => i.instanceLocaId === "generic_country_NL");
const translationData = require('e4k-data').languages.nl;
let _empireClient = new Client(process.env.empireName, process.env.empirePassword, dutchNetworkInstance, process.env.mode === 'debug');
let e4kAnnouncementChannel;

module.exports.client = _empireClient;

/** @returns {Promise<Client>} */
module.exports.connect = function () {
    return new Promise(async (res, rej) => {
        try {
            _empireClient.equipments.autoDeleteAtOrBelowRarity = Constants.EquipmentRarity.Epic;
            _empireClient.reconnectTimeout = 5;
            _empireClient.language = 'nl';
            _empireClient._socket.ultraDebug = process.env.ultraDebug === 'true';
            await setListeners();
            await _empireClient.connect();
            await _empireClient.equipments.sellAllEquipmentsAtOrBelowRarity(Constants.EquipmentRarity.Epic)
            require('./rankings')
            res(_empireClient);
        } catch (e) {
            rej(e);
        }
    })
}

async function setListeners() {
    /** @type {Guild}*/
    let guild = require('./index').dcClient.guilds.cache.find(guild => guild.id === nlserver.id);
    e4kAnnouncementChannel = await guild.channels.fetch('1145060114353639484');

    _empireClient.on("mailMessageAdd", async (m) => {
        try {
            await handleMailMessage(m)
        } catch (e) {
        }
    })
    _empireClient.on('serverShutdown', async () => {
        try {
            await e4kAnnouncementChannel.send({content: translationData.generic_flash.alert.generic_alert_connection_lost_description});
        } catch (e) {
        }
    })
    _empireClient.on('serverShutdownEnd', async () => {
        try {
            await e4kAnnouncementChannel.send({content: "Onderhoud is voorbij. De server is weer bereikbaar."});
        } catch (e) {
        }
    })
    _empireClient.on('primeTime', async (p) => {
        try {
            await handlePrimeTime(p)
        } catch (e) {
        }
    })
}
