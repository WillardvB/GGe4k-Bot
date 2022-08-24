const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    name: "ssd",
    execute(socket, errorCode, params) {
        socket.client.emit('serverShutdown');
        setTimeout(checkMaintenanceOver, 10000, socket.client);
    }
}

async function checkMaintenanceOver(client){
    let response = await fetch('https://media.goodgamestudios.com/games-config/network/status/16/maint.json');
    let json = await response.json();
    if(json.toString() !== "")
        setTimeout(checkMaintenanceOver, 10000);
    else
        client.connect();
}