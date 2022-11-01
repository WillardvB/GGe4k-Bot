const {Client} = require("ggejs");
let _empireClient = new Client("", "", 300);

function _connect() {
    return new Promise(async (res, rej) => {
        try {
            _empireClient = new Client("e4k-nl", process.env.empirePassword, 300);
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