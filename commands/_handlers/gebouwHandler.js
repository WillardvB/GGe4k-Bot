module.exports = {
    name: 'gebouw',
    description: 'Toont al je gewenste gebouwdata!',
    execute(client, message, args) {
        let dataSoort = args.shift();
        if (dataSoort == null) {
            return message.reply({ content: "zie `gge help gebouw` voor de gebouw-command mogelijkheden" });
        }
        dataSoort = dataSoort.trim();
        if (dataSoort == 'kosten' || dataSoort == "kost" || dataSoort == "costs" || dataSoort == "cost" || dataSoort == "k" || dataSoort == "c") {
            client.gebouwCommands.get('gebouw kosten').execute(client, message, args);
            return;
        }
        else if (dataSoort == 'algemeen' || dataSoort == "alg" || dataSoort == "general" || dataSoort == "gen" || dataSoort == "a" || dataSoort == "g") {
            client.gebouwCommands.get('gebouw algemeen').execute(client, message, args);
            return;
        } else {
            return message.reply({ content: "zie `gge help gebouw` voor de gebouw-command mogelijkheden" });
        }
    },
};