const { MessageEmbed } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const thumbnail = "https://st.depositphotos.com/1654249/2526/i/600/depositphotos_25269357-stock-photo-3d-man-with-red-question.jpg"

module.exports = {
	name: 'help gebouw',
	description: 'Toont alle mogelijke gebouw commands!',
	execute(client, message) {
    embed = new MessageEmbed() 
      .setTitle("**Help!**")
      .setDescription("Alle mogelijke gebouw commands.")
      .setColor("#FF0000")
      .setFooter(footerTekst, footerAfbeelding)
      .setTimestamp()
      .setThumbnail(thumbnail);

    client.gebouwCommands.map(command =>{
      let comm = command.name;
      let descrip = command.description;
      if(comm != "" && comm != null && descrip != "" && descrip != null){
        let commNaam = comm.charAt(0).toUpperCase() + comm.slice(1);
        embed.addField("**"+commNaam+"**", descrip + "\n**Format:** " + command.format + "\n***Ook te gebruiken als:*** *" + command.aka + "* \n***Voorbeelden:*** *" + command.voorbeeld + "*");
      }
    })
    message.channel.send({embeds:[embed]});
    if(message.channel.guild != null){
      message.delete();
    }
	},
};