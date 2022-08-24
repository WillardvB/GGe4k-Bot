module.exports = {
    name: "apiOK",
    execute(socket) {
        require('./../../connection.js').onConnection(socket, { "success": true });
    }
}