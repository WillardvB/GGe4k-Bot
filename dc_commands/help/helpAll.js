const rechten = require('./../../tools/rechten.js');
const { MessageEmbed } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const thumbnail = "https://st.depositphotos.com/1654249/2526/i/600/depositphotos_25269357-stock-photo-3d-man-with-red-question.jpg"

module.exports = {
	name: 'help all',
	description: 'Toont alle mogelijke commands!',
	execute(client, message) {
    embed = new MessageEmbed() 
      .setTitle("**Help!**")
      .setDescription("Alle mogelijke commandsoorten.\n\n*Gebruik ```gge help [commandsoort]``` voor de mogelijkheden per soort.\nVoorbeeld: ```gge help gebouw```*")
      .setColor("#FF0000")
      .setFooter(footerTekst, footerAfbeelding)
      .setTimestamp()
      .setThumbnail(thumbnail);
    client.commands.map(command =>{
      let comm = command.name;
      let descrip = command.description;
      if(command.nietInHelp){
        return;
      }
      if(command.modFunc){
        const guild = message.channel.guild;
        if(guild == null){
          return;
        }
        else if(rechten.isGeenMod(message.channel.guild.members.cache.get(message.author.id))){
          return;
        }
      }
      if(command.adminFunc){
        const guild = message.channel.guild;
        if(guild == null){
          return;
        }
        else if(rechten.isGeenAdmin(guild.members.cache.get(message.author.id))){
          return;
        }
      }
      if(comm != "" && comm != null && descrip != "" && descrip != null){
        let commNaam = comm.charAt(0).toUpperCase() + comm.slice(1);
        embed.addField("**"+commNaam+"**", descrip);
      }
    })
    message.channel.send({embeds:[embed]});
    if(message.channel.guild != null){
      message.delete();
    }
	},
};