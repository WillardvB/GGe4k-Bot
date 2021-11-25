/*
function setAsDJ(guildID, userID, i) {
    const guild = client.guilds.cache.find(guild => guild.id == guildID);
    const rol = guild.roles.cache.find(role => role.id == rollen.server.dj);
    const member = guild.members.cache.find(member => member.id == userID);
    member.roles.add(rol);
    guild.members.cache.find(member => member.id == client.user.id).roles.add(rol);
}


function removeAsDJ(guildID, userID, i) {
    const guild = client.guilds.cache.find(guild => guild.id == guildID);
    const rol = guild.roles.cache.find(role => role.id == rollen.server.dj);
    const member = guild.members.cache.find(member => member.id == userID);
    member.roles.remove(rol).catch(e => {
    console.log(e);
  });
    guild.members.cache
        .find(member => member.id == client.user.id)
        .roles.remove(rol);
    var channel = guild.channels.cache.find(
        channel => channel.name == 'dj_controller'
    );
    var muziekChannel = guild.channels.cache.find(
        channel => channel.id == kanalen.nlserver.voice.muziek//.name == 'disco'
    );
    var category = guild.channels.cache.find(
        channel => channel.name.toLowerCase() == `party (tot ${geplandePartys.partyAvonden[i].eind_tijd})`
    );
    if (channel != null) {
        channel.delete();
    }
  if(muziekChannel != null){
    muziekChannel.setParent(825356099757932544, {lockPermissions: false, reason: "einde party"});
    }
  /*if (muziekChannel != null) {
        muziekChannel.delete();
  }*//*
if (category != null) {
    category.delete();
}
geplandePartys.partyAvonden.splice(i, 1);
try {
    fs.writeFileSync(
        'E4K_NL_bot/geplandePartyAvonden.json',
        JSON.stringify(geplandePartys, null, 2),
        'utf8'
    );
    console.log('The file was saved!');
} catch (err) {
    console.log('An error has ocurred when saving the file.');
}
}

*/