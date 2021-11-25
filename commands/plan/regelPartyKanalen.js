const fs = require('fs');
const rollen = require('./../../data/rollen.json');
let geplandePartys;

module.exports = {
	async execute(client) {
    geplandePartys = require('./../../data/geplandePartys.json');
    const nu = Date.now();
    for (var i = 0; i < geplandePartys.partys.length; i++) {
      await regelPartyKanalen(client, i, nu);
    }
  }
}

function regelPartyKanalen(client, i, nu) {
	const party = geplandePartys.partys[i];
	if (party.timestamp - (nu + 7200000) < 0) {
		if (party.guildID == '') {
			return;
		}
    const guild = client.guilds.cache.find(guild => guild.id == party.guildID);
    var category = guild.channels.cache.find(channel => channel.name == 'party');
		if (category == null) {
      guild.channels.create(`party`, {
        type: 'GUILD_CATEGORY',
        position: 0,
        reason: "Om te feesten",
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: ['VIEW_CHANNEL']
          }
        ]
      })
      .then(parentChannel => {
        var djKanaal = guild.channels.cache.find(
          channel => channel.name == 'dj_controller'
        );
        if (djKanaal == null) {
          guild.channels.create('dj_controller', {
            type: 'GUILD_TEXT',
            parent: parentChannel,
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL']
              },
              {
                id: rollen.server.dj,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']
              }
            ]
          })
          .then(()=>{
            var musicChannel = guild.channels.cache.find(
					    channel => channel.name.toLowerCase() == 'disco'
				    );
            if (musicChannel == null) {
              guild.channels.create('Disco', {
                type: 'GUILD_VOICE',
                parent: parentChannel,
                permissionOverwrites: [
                  {
                    id: guild.roles.everyone.id,
                    deny: ['SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],
                    allow: ['VIEW_CHANNEL']
                  },
                  {
                    id: rollen.server.dj,
                    allow: ['SPEAK','PRIORITY_SPEAKER','STREAM','MUTE_MEMBERS','USE_VAD']
                  }
                ]
              })
              .then(()=>{
                var chatChannel = guild.channels.cache.find(
                  channel => channel.name.toLowerCase() == 'partychat'
                );
                if (chatChannel == null) {
                  guild.channels.create('PartyChat', {
                    type: 'GUILD_TEXT',
                    parent: parentChannel,
                    permissionOverwrites: [
                      {
                        id: guild.roles.everyone.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']
                      },
                      {
                        id: rollen.server.dj,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                      }
                    ]
                  })
                  .then(() => {
                    geplandePartys.partys.splice(i, 1);
                    try {
                      fs.writeFileSync(
                        'E4K_NL_bot/data/geplandePartys.json',
                        JSON.stringify(geplandePartys, null, 2),
                        'utf8'
                      );
                    } catch (err) {
                      console.log('An error has ocurred when saving the file.');
                    }
                  })
                  .catch(console.log);
                }
              })
              .catch(console.log);
            }
          })
          .catch(console.log);
        }
      })
      .catch(console.log);
	  }
    else
    {
      geplandePartys.partys.splice(i, 1);
      try {
        fs.writeFileSync(
          '/app/data/geplandePartys.json',
          JSON.stringify(geplandePartys, null, 2),
          'utf8'
        );
      } catch (err) {
        console.log('An error has ocurred when saving the file: ' + err);
      }
    }
	}
}