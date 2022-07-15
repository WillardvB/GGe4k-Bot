module.exports = {
    name: "apiOK",
    execute() {
        require('./../../connection.js').onConnection({ "success": true });
    }
}