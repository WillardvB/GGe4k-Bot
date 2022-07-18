let commands = [];
console.log(__dirname);
const commandsPath = path.join(__dirname, '../sys');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands[command.name] = command.execute;
}

module.exports = {
    /**
     * 
     * @param {object} event
     */
    onResponse(event) {
        let action = event.body["$"].action;
        let handler = commands[action];
        if (handler != null) {
            handler.apply(this, [event]);
        }
        else {
            console.log("[ERROR] Unknown sys command: " + action);
        }
    }
}