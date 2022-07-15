module.exports = {
    name: "apiKO",
    execute() {
        require('./../../connection.js').onConnection({ "success": false, "error": "API are obsolete, please upgrade" });
    }
}