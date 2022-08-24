module.exports = {
    name: "apiKO",
    execute(socket) {
        require('./../../connection.js').onConnection(socket, { "success": false, "error": "API are obsolete, please upgrade" });
    }
}