module.exports = {
    name: 'titel',
    description: 'Toont al je gewenste titeldata!',
    execute(client, message, args) {
        let dataSoort = args.shift();
        if (dataSoort == null) {
            return message.reply({ content: "zie `gge help titel` voor de titel-command mogelijkheden" });
        }
        dataSoort = dataSoort.trim();
        if (dataSoort == 'houden' || dataSoort == "houd" || dataSoort == "h" || dataSoort == "hold" || dataSoort == "keep" || dataSoort == "k") {
            client.titelCommands.get('titel houden').execute(client, message, args);
            return;
        }
        else if (dataSoort == 'info' || dataSoort == "i" || dataSoort == "information" || dataSoort == "informatie") {
            client.titelCommands.get('titel info').execute(client, message, args);
            return;
        }
        else if (dataSoort == "namen" || dataSoort == "naam" || dataSoort == "names" || dataSoort == "name" || dataSoort == "n") {
            client.titelCommands.get('titel namen').execute(client, message, args);
            return;
        }
        else {
            return message.reply({ content: "zie `gge help titel` voor de titel-command mogelijkheden" });
        }
    },
};