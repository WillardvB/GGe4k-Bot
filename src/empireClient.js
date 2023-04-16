const {Client, Constants} = require("ggejs");
const networkInstances = require('e4k-data').network.instances.instance;
const dutchNetworkInstance = networkInstances.find(i => i.instanceLocaId === "generic_country_NL");
/** @type {Client} */
let _empireClient;

function _connect() {
    return new Promise(async (res, rej) => {
        try {
            _empireClient = new Client("e4k-nl", process.env.empirePassword, dutchNetworkInstance);
            await _empireClient.connect();
            res(_empireClient);
        } catch (e) {
            rej(e);
        }
    })
}

module.exports = {
    /**
     *
     * @returns {Client}
     */
    get client() {
        return _empireClient
    },
    /**
     *
     * @returns {Promise<Client>}
     */
    connect() {
        return new Promise(async (res, rej) => {
            try {
                await _connect();
                res(_empireClient);
            } catch (e) {
                rej(e);
            }
        })
    }
}